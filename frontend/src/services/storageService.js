// storageService.js
const STORAGE_KEY = 'dsa_progress_data';

export const dsaService = {
  
  saveProgress: (sheetId, problemId, status) => {
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (!allData[sheetId]) allData[sheetId] = {};
    
    allData[sheetId][problemId] = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
  },

 
  getProgress: (sheetId) => {
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return allData[sheetId] || {};
  }
};