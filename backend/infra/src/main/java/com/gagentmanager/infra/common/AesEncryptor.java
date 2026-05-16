package com.gagentmanager.infra.common;

import cn.hutool.crypto.symmetric.AES;

/** AES 加密工具类，用于加密敏感数据（如 API Key），密钥优先读取环境变量 */
public class AesEncryptor {

    private static final AES aes;

    static {
        String key = System.getenv("AES_ENCRYPT_KEY");
        if (key == null || key.isEmpty()) {
            key = "GAgentManagerAesKey256"; // 20 chars, pad to 32
        }
        byte[] keyBytes = new byte[32];
        byte[] raw = key.getBytes();
        System.arraycopy(raw, 0, keyBytes, 0, Math.min(raw.length, 32));
        aes = new AES(keyBytes);
    }

    public static String encrypt(String plainText) {
        if (plainText == null || plainText.isEmpty()) {
            return plainText;
        }
        return aes.encryptBase64(plainText);
    }

    public static String decrypt(String cipherText) {
        if (cipherText == null || cipherText.isEmpty()) {
            return cipherText;
        }
        return aes.decryptStr(cipherText);
    }
}
