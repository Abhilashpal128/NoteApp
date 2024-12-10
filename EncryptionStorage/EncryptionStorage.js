import EncryptedStorage from 'react-native-encrypted-storage';

const encryptData = async (key, data) => {
  try {
    await EncryptedStorage.setItem(key, data);
    return key;
  } catch (error) {
    console.error('Error encrypting data:', error);
    return null;
  }
};

const decryptData = async key => {
  try {
    const decryptedData = await EncryptedStorage.getItem(key);
    return decryptedData;
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};

export {encryptData, decryptData};
