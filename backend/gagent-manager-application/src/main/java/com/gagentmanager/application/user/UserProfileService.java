package com.gagentmanager.application.user;

import com.gagentmanager.client.user.PasswordChangeParam;
import com.gagentmanager.client.user.UpdateProfileParam;
import com.gagentmanager.client.user.UserProfileVO;
import com.gagentmanager.domain.user.User;
import com.gagentmanager.domain.user.UserRepository;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/** 用户个人中心服务，提供个人资料修改/密码修改/头像更新/MFA 开关 */
@Service
public class UserProfileService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserProfileVO getProfile(Long userId) {
        User user = userRepository.findById(userId);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        return toProfileVO(user, Collections.emptyList());
    }

    public void updateProfile(Long userId, UpdateProfileParam param) {
        User user = userRepository.findById(userId);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        user.updateProfile(param.getRealName(), param.getPhone(), param.getEmail(), userId);
        userRepository.save(user, userId);
    }

    public void changePassword(Long userId, PasswordChangeParam param) {
        User user = userRepository.findById(userId);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        if (!passwordEncoder.matches(param.getOldPassword(), user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.PASSWORD_INCORRECT);
        }
        user.resetPassword(passwordEncoder.encode(param.getNewPassword()), userId);
        userRepository.save(user, userId);
    }

    public void updateAvatar(Long userId, String avatarUrl) {
        User user = userRepository.findById(userId);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        user.updateAvatar(avatarUrl, userId);
        userRepository.save(user, userId);
    }

    public void toggleMfa(Long userId, Boolean enabled) {
        User user = userRepository.findById(userId);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        user.toggleMfa(enabled, userId);
        userRepository.save(user, userId);
    }

    private UserProfileVO toProfileVO(User user, List<String> roleNames) {
        UserProfileVO vo = new UserProfileVO();
        vo.setUserId(user.getId());
        vo.setUsername(user.getUsername());
        vo.setRealName(user.getRealName());
        vo.setNickname(user.getNickname());
        vo.setPhone(user.getPhone());
        vo.setEmail(user.getEmail());
        vo.setDepartment(user.getDepartment());
        vo.setAvatar(user.getAvatar());
        vo.setSource(user.getSource());
        vo.setStatus(user.getStatus());
        vo.setRoleNames(roleNames);
        vo.setMfaEnabled(user.getMfaEnabled());
        vo.setLastLoginTime(user.getLastLoginTime());
        vo.setLastLoginIp(user.getLastLoginIp());
        return vo;
    }
}
