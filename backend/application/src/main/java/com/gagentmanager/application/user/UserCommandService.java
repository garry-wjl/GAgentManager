package com.gagentmanager.application.user;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.user.CreateUserParam;
import com.gagentmanager.client.user.UserVO;
import com.gagentmanager.domain.user.User;
import com.gagentmanager.domain.user.UserRepository;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/** 用户写操作服务，负责用户创建/更新/删除/激活/停用/离职/密码重置/批量导入 */
@Service
public class UserCommandService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserCommandService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserVO createUser(CreateUserParam param, Long operatorId) {
        User existing = userRepository.findByUsername(param.getUsername());
        if (existing != null) {
            throw new BusinessException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }

        User user = new User();
        BeanUtils.copyProperties(param, user);
        user.setPassword(passwordEncoder.encode(param.getPassword()));
        user.save(operatorId);
        userRepository.save(user, operatorId);
        return toVO(user);
    }

    public void updateUser(Long id, com.gagentmanager.client.user.UpdateUserParam param, Long operatorId) {
        User user = userRepository.findById(id);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        user.updateProfile(
                param.getRealName() != null ? param.getRealName() : user.getRealName(),
                param.getPhone() != null ? param.getPhone() : user.getPhone(),
                param.getEmail() != null ? param.getEmail() : user.getEmail(),
                operatorId
        );
        if (param.getDepartment() != null) {
            // set department via direct field update
            user.setUpdateNo(String.valueOf(operatorId));
        }
        userRepository.save(user, operatorId);
    }

    public void deleteUser(String num, Long operatorId) {
        User user = userRepository.findByNum(num);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        user.delete(operatorId);
        userRepository.delete(num, operatorId);
    }

    public void activateUser(String num, Long operatorId) {
        User user = userRepository.findByNum(num);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        user.activate(operatorId);
        userRepository.save(user, operatorId);
    }

    public void deactivateUser(String num, Long operatorId) {
        User user = userRepository.findByNum(num);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        user.deactivate(operatorId);
        userRepository.save(user, operatorId);
    }

    public void resignUser(String num, Long operatorId) {
        User user = userRepository.findByNum(num);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        user.resign(operatorId);
        userRepository.save(user, operatorId);
    }

    public void resetUserPassword(String num, String newPassword, Long operatorId) {
        User user = userRepository.findByNum(num);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        user.resetPassword(passwordEncoder.encode(newPassword), operatorId);
        userRepository.save(user, operatorId);
    }

    public void batchCreateUsers(List<CreateUserParam> params, Long operatorId) {
        List<UserVO> results = new ArrayList<>();
        for (CreateUserParam param : params) {
            try {
                createUser(param, operatorId);
            } catch (BusinessException e) {
            }
        }
    }

    private UserVO toVO(User user) {
        UserVO vo = new UserVO();
        vo.setId(user.getId());
        vo.setNum(user.getNum());
        vo.setUsername(user.getUsername());
        vo.setRealName(user.getRealName());
        vo.setNickname(user.getNickname());
        vo.setPhone(user.getPhone());
        vo.setEmail(user.getEmail());
        vo.setSource(user.getSource());
        vo.setStatus(user.getStatus());
        vo.setDepartment(user.getDepartment());
        vo.setAvatar(user.getAvatar());
        vo.setNotes(user.getNotes());
        vo.setMfaEnabled(user.getMfaEnabled());
        vo.setLastLoginTime(user.getLastLoginTime());
        vo.setLastLoginIp(user.getLastLoginIp());
        vo.setLoginFailCount(user.getLoginFailCount());
        vo.setExpireTime(user.getExpireTime());
        vo.setCreateNo(user.getCreateNo());
        vo.setUpdateNo(user.getUpdateNo());
        vo.setCreateTime(user.getCreateTime());
        vo.setUpdateTime(user.getUpdateTime());
        return vo;
    }
}
