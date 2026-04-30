package com.gagentmanager.application.user;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.user.UserVO;
import com.gagentmanager.domain.user.User;
import com.gagentmanager.domain.user.UserRepository;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

/** 用户查询服务，提供用户列表/详情查询和 VO 转换 */
@Service
public class UserQueryService {

    private final UserRepository userRepository;

    public UserQueryService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserVO getUserById(Long id) {
        User user = userRepository.findById(id);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        return toVO(user);
    }

    public UserVO getUserByNum(String num) {
        User user = userRepository.findByNum(num);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        return toVO(user);
    }

    public IPage<UserVO> listUsers(PageParam pageParam, String keyword, String status) {
        Page<User> page = new Page<>(pageParam.getPageNo(), pageParam.getPageSize());
        IPage<User> userPage = userRepository.list(page, keyword, status);
        return userPage.convert(this::toVO);
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
