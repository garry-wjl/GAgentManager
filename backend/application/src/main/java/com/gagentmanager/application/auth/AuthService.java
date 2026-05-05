package com.gagentmanager.application.auth;

import com.gagentmanager.application.util.JwtUtil;
import com.gagentmanager.client.auth.LoginParam;
import com.gagentmanager.client.auth.LoginVO;
import com.gagentmanager.client.auth.RefreshTokenParam;
import com.gagentmanager.client.auth.ResetPasswordParam;
import com.gagentmanager.domain.user.User;
import com.gagentmanager.domain.user.UserRepository;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import io.jsonwebtoken.Claims;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/** 认证服务，处理登录/登出/刷新 Token/密码重置等流程 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public LoginVO login(LoginParam param, String ip) {
        User user = userRepository.findByUsername(param.getUsername());
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        user.assertNotLocked();
        user.assertEnabled();

        if (!passwordEncoder.matches(param.getPassword(), user.getPasswordHash())) {
            user.recordLoginFail();
            userRepository.save(user, user.getId());
            throw new BusinessException(ErrorCode.PASSWORD_INCORRECT);
        }

        user.recordLogin(ip);
        userRepository.save(user, user.getId());

        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getUsername());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());

        LoginVO vo = new LoginVO();
        vo.setAccessToken(accessToken);
        vo.setRefreshToken(refreshToken);
        vo.setExpiresIn(7200L);
        vo.setUserId(user.getId());
        vo.setUsername(user.getUsername());
        vo.setRealName(user.getRealName());
        vo.setAvatar(user.getAvatar());
        vo.setMfaRequired(user.getMfaEnabled() != null && user.getMfaEnabled());
        return vo;
    }

    public void logout(Long userId) {
    }

    public LoginVO refreshToken(RefreshTokenParam param) {
        io.jsonwebtoken.Claims claims = jwtUtil.parseRefreshToken(param.getRefreshToken());
        Long userId = Long.valueOf(claims.getSubject());
        User user = userRepository.findById(userId);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        user.assertEnabled();

        String newAccessToken = jwtUtil.generateAccessToken(user.getId(), user.getUsername());
        String newRefreshToken = jwtUtil.generateRefreshToken(user.getId());

        LoginVO vo = new LoginVO();
        vo.setAccessToken(newAccessToken);
        vo.setRefreshToken(newRefreshToken);
        vo.setExpiresIn(7200L);
        vo.setUserId(user.getId());
        vo.setUsername(user.getUsername());
        vo.setRealName(user.getRealName());
        vo.setAvatar(user.getAvatar());
        return vo;
    }

    public void resetPassword(ResetPasswordParam param) {
        User user = userRepository.findByUsername(param.getUsername());
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        if (!param.getEmail().equals(user.getEmail())) {
            throw new BusinessException(ErrorCode.EMAIL_NOT_MATCH);
        }
        String newPasswordHash = passwordEncoder.encode(param.getNewPassword());
        user.resetPassword(newPasswordHash, user.getId());
        userRepository.save(user, user.getId());
    }

    public void resetPasswordByAdmin(Long userId, String newPassword, Long operatorId) {
        User user = userRepository.findById(userId);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        String newPasswordHash = passwordEncoder.encode(newPassword);
        user.resetPassword(newPasswordHash, operatorId);
        userRepository.save(user, operatorId);
    }
}
