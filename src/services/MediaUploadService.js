/**
 * 媒体上传服务
 * 处理图片、视频、语音、文件的上传、压缩、预览
 */

class MediaUploadService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    this.maxImageSize = 10 * 1024 * 1024; // 10MB
    this.maxVideoSize = 100 * 1024 * 1024; // 100MB
    this.maxFileSize = 50 * 1024 * 1024; // 50MB
  }

  /**
   * 上传图片
   */
  async uploadImage(file, options = {}) {
    const {
      compress = true,
      maxWidth = 1920,
      maxHeight = 1920,
      quality = 0.8
    } = options;

    // 检查文件大小
    if (file.size > this.maxImageSize) {
      throw new Error(`图片大小不能超过 ${this.maxImageSize / 1024 / 1024}MB`);
    }

    try {
      // 压缩图片（如果需要）
      const processedFile = compress ? await this.compressImage(file, maxWidth, maxHeight, quality) : file;
      
      // 生成缩略图
      const thumbnail = await this.generateThumbnail(processedFile, 200, 200);
      
      // 上传到服务器
      const imageUrl = await this.uploadFile(processedFile, 'image');
      const thumbnailUrl = await this.uploadFile(thumbnail, 'thumbnail');
      
      return {
        url: imageUrl,
        thumbnail: thumbnailUrl,
        size: processedFile.size,
        width: await this.getImageDimensions(processedFile).then(d => d.width),
        height: await this.getImageDimensions(processedFile).then(d => d.height)
      };
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  }

  /**
   * 压缩图片
   */
  compressImage(file, maxWidth, maxHeight, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // 计算缩放比例
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            },
            file.type,
            quality
          );
        };
        
        img.onerror = reject;
        img.src = e.target.result;
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * 生成缩略图
   */
  generateThumbnail(file, width, height) {
    return this.compressImage(file, width, height, 0.7);
  }

  /**
   * 获取图片尺寸
   */
  getImageDimensions(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = reject;
        img.src = e.target.result;
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * 上传视频
   */
  async uploadVideo(file, onProgress) {
    if (file.size > this.maxVideoSize) {
      throw new Error(`视频大小不能超过 ${this.maxVideoSize / 1024 / 1024}MB`);
    }

    try {
      // 获取视频信息
      const videoInfo = await this.getVideoInfo(file);
      
      // 生成视频封面
      const thumbnail = await this.generateVideoThumbnail(file);
      const thumbnailUrl = await this.uploadFile(thumbnail, 'thumbnail');
      
      // 上传视频
      const videoUrl = await this.uploadFile(file, 'video', onProgress);
      
      return {
        url: videoUrl,
        thumbnail: thumbnailUrl,
        duration: videoInfo.duration,
        size: file.size,
        width: videoInfo.width,
        height: videoInfo.height
      };
    } catch (error) {
      console.error('Video upload failed:', error);
      throw error;
    }
  }

  /**
   * 获取视频信息
   */
  getVideoInfo(file) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve({
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight
        });
      };
      
      video.onerror = reject;
      video.src = URL.createObjectURL(file);
    });
  }

  /**
   * 生成视频封面
   */
  generateVideoThumbnail(file) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        video.currentTime = Math.min(1, video.duration / 2); // 取中间帧
      };
      
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(video.src);
          const thumbnailFile = new File([blob], 'thumbnail.jpg', {
            type: 'image/jpeg'
          });
          resolve(thumbnailFile);
        }, 'image/jpeg', 0.8);
      };
      
      video.onerror = reject;
      video.src = URL.createObjectURL(file);
    });
  }

  /**
   * 录制语音
   */
  async startVoiceRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];
      
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      
      return {
        recorder: mediaRecorder,
        stream,
        getBlob: () => new Promise((resolve) => {
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            resolve(blob);
          };
        })
      };
    } catch (error) {
      console.error('Failed to start voice recording:', error);
      throw new Error('无法访问麦克风');
    }
  }

  /**
   * 上传语音
   */
  async uploadVoice(blob, duration) {
    try {
      const file = new File([blob], `voice_${Date.now()}.webm`, {
        type: 'audio/webm'
      });
      
      const url = await this.uploadFile(file, 'voice');
      
      return {
        url,
        duration: Math.round(duration),
        size: file.size
      };
    } catch (error) {
      console.error('Voice upload failed:', error);
      throw error;
    }
  }

  /**
   * 上传文件
   */
  async uploadFileMessage(file, onProgress) {
    if (file.size > this.maxFileSize) {
      throw new Error(`文件大小不能超过 ${this.maxFileSize / 1024 / 1024}MB`);
    }

    try {
      const url = await this.uploadFile(file, 'file', onProgress);
      
      return {
        url,
        fileName: file.name,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  /**
   * 通用文件上传
   */
  async uploadFile(file, type, onProgress) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // 上传进度
      if (onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            onProgress(progress);
          }
        };
      }
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response.url);
          } catch (error) {
            reject(new Error('上传响应解析失败'));
          }
        } else {
          reject(new Error(`上传失败: ${xhr.status}`));
        }
      };
      
      xhr.onerror = () => reject(new Error('网络错误'));
      
      xhr.open('POST', `${this.baseUrl}/api/upload`);
      
      // 添加认证头
      const token = localStorage.getItem('seer_auth_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      xhr.send(formData);
    });
  }

  /**
   * 取消上传（通过 AbortController）
   */
  createUploadTask(file, type, onProgress) {
    const controller = new AbortController();
    
    const upload = async () => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      const token = localStorage.getItem('seer_auth_token');
      
      const response = await fetch(`${this.baseUrl}/api/upload`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error(`上传失败: ${response.status}`);
      }
      
      const result = await response.json();
      return result.url;
    };
    
    return {
      promise: upload(),
      cancel: () => controller.abort()
    };
  }

  /**
   * 验证文件类型
   */
  validateFileType(file, allowedTypes) {
    return allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', ''));
      }
      return file.type === type;
    });
  }

  /**
   * 格式化文件大小
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * 格式化时长
   */
  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

const mediaUploadService = new MediaUploadService();
export default mediaUploadService;

