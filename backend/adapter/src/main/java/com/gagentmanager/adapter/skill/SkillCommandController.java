package com.gagentmanager.adapter.skill;

import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.skill.SkillCommandService;
import com.gagentmanager.client.skill.*;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/** Skill 管理端 Command REST 接口，处理 Skill 的增删改/安装/卸载/评价等写操作请求 */
@RestController
@RequestMapping("/api/skill/command")
public class SkillCommandController extends BaseController {

    private final SkillCommandService skillCommandService;

    public SkillCommandController(SkillCommandService skillCommandService) {
        this.skillCommandService = skillCommandService;
    }

    @PostMapping("/create")
    public Result<SkillVO> createSkill(@Valid @RequestBody CreateSkillParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        return success(skillCommandService.createSkill(param, operatorId));
    }

    @PostMapping("/update")
    public Result<Void> updateSkill(@Valid @RequestBody UpdateSkillParam param, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        skillCommandService.updateSkill(param, operatorId);
        return success();
    }

    @PostMapping("/delete")
    public Result<Void> deleteSkill(@RequestParam String num, HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        skillCommandService.deleteSkill(num, operatorId);
        return success();
    }

    @PostMapping("/install")
    public Result<Void> installSkill(@RequestParam String num, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        skillCommandService.installSkill(num, userId);
        return success();
    }

    @PostMapping("/uninstall")
    public Result<Void> uninstallSkill(@RequestParam String num, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        skillCommandService.uninstallSkill(num, userId);
        return success();
    }

    @PostMapping("/review")
    public Result<Void> reviewSkill(@Valid @RequestBody SkillReviewParam param, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        skillCommandService.reviewSkill(param, userId);
        return success();
    }

    @PostMapping("/upload-package")
    public Result<SkillVO> uploadPackage(@RequestParam String num,
                                         @RequestParam("file") MultipartFile file,
                                         HttpServletRequest request) {
        Long operatorId = (Long) request.getAttribute("userId");
        return success(skillCommandService.uploadPackage(num, file, operatorId));
    }
}
