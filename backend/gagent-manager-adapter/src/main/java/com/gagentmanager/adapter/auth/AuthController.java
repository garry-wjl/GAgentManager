package com.gagentmanager.adapter.auth;

import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.auth.AuthService;
import com.gagentmanager.application.user.UserQueryService;
import com.gagentmanager.client.auth.LoginParam;
import com.gagentmanager.client.auth.LoginVO;
import com.gagentmanager.client.auth.RefreshTokenParam;
import com.gagentmanager.client.auth.ResetPasswordParam;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 认证 REST 接口，处理登录/登出/刷新 Token/密码重置请求 */
@RestController
@RequestMapping("/api/auth")
public class AuthController extends BaseController {

    private final AuthService authService;
    private final UserQueryService userQueryService;

    public AuthController(AuthService authService, UserQueryService userQueryService) {
        this.authService = authService;
        this.userQueryService = userQueryService;
    }

    @PostMapping("/login")
    public Result<LoginVO> login(@Valid @RequestBody LoginParam param, HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        LoginVO vo = authService.login(param, ip);
        return success(vo);
    }

    @GetMapping("/current")
    public Result<com.gagentmanager.client.user.UserVO> getCurrentUser(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            return fail(401, "未登录");
        }
        return success(userQueryService.getUserById(userId));
    }

    @PostMapping("/logout")
    public Result<Void> logout() {
        authService.logout(null);
        return success();
    }

    @PostMapping("/refresh")
    public Result<LoginVO> refresh(@Valid @RequestBody RefreshTokenParam param) {
        return success(authService.refreshToken(param));
    }

    @PostMapping("/reset-password")
    public Result<Void> resetPassword(@Valid @RequestBody ResetPasswordParam param) {
        authService.resetPassword(param);
        return success();
    }
}
