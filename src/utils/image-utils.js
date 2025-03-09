// image-utils.js
// You can optionally move the image detection function to this separate file

/**
 * Detect if a URL appears to be a medical image or scan
 * @param {string} url - The URL to check
 * @returns {boolean} - True if the URL appears to be a medical image
 */
export const detectImageUrl = (url) => {
    if (!url) return false;
    
    // Check for common medical imaging file extensions
    if (url.match(/\.(dcm|dicom|ima|nii|nii\.gz|mgh|mgz|mha|mhd|nrrd)$/i)) {
      return true;
    }
    
    // Check for WADO endpoints or OHIF/DICOM web viewers
    if (url.includes('wado') || 
        url.includes('dicomweb') || 
        url.includes('viewer') || 
        url.includes('dicom') || 
        url.includes('pacs') ||
        url.includes('ohif') ||
        url.includes('scan') ||
        url.includes('ct')) {
      return true;
    }
    
    return false;
  };
  
  /**
   * Process an image URL to a format that Cornerstone can understand
   * @param {string} url - The raw image URL
   * @returns {string} - The processed image ID for Cornerstone
   */
  export const processImageUrl = (url) => {
    if (!url) return '';
    
    // Detect if the URL is a DICOM file
    if (url.endsWith('.dcm')) {
      return `wadouri:${url}`;
    } 
    // Detect if URL is for WADO-URI
    else if (url.includes('wado') && !url.includes('wadouri:')) {
      return `wadouri:${url}`;
    }
    // Detect if URL is a standard web image
    else if (url.match(/\.(jpe?g|png)$/i)) {
      return `http:${url}`;
    }
    
    // Default case - try as wadouri
    return `wadouri:${url}`;
  };