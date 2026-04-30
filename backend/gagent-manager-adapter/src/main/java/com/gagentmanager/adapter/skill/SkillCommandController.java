package com.gagentmanager.adapter.skill;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.skill.SkillCommandService;
import com.gagentmanager.application.skill.SkillQueryService;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.skill.*;
import com.gagentmanager.facade.common.PageResult;
import com.gagentmanager.facade.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Skill 管理端 REST 接口，处理 Skill 的增删改查/安装/卸载/评价/版本请求 */
@RestController
@RequestMapping("/api/admin/skills")
public class SkillCommandController extends BaseController {

    private final SkillCommandService skillCommandService;
    private final SkillQueryService skillQueryService;

    public SkillCommandController(SkillCommandService skillCommandService, SkillQueryService skillQueryService) {
        this.skillCommandService = skillCommandService;
        this.skillQueryService = skillQueryService;
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

    @GetMapping("/get")
    public Result<SkillVO> get(@RequestParam Long id) {
        return success(skillQueryService.getSkillById(id));
    }

    @GetMapping("/detail")
    public Result<SkillVO> detail(@RequestParam String num) {
        return success(skillQueryService.getSkillByNum(num));
    }

    @GetMapping("/list")
    public Result<PageResult<SkillVO>> list(PageParam pageParam, String keyword, String category, String status) {
        IPage<SkillVO> page = skillQueryService.listSkills(pageParam, keyword, category, status);
        return success(PageResult.of(page.getRecords(), page.getTotal(), (int) page.getCurrent(), (int) page.getSize()));
    }

    @GetMapping("/versions")
    public Result<List<SkillVersionVO>> versions(@RequestParam String skillNum) {
        return success(skillQueryService.listVersions(skillNum));
    }

    @GetMapping("/reviews")
    public Result<PageResult<SkillReviewVO>> reviews(PageParam pageParam, @RequestParam String skillNum) {
        IPage<SkillReviewVO> page = skillQueryService.listReviews(pageParam, skillNum);
        return success(PageResult.of(page.getRecords(), page.getTotal(), (int) page.getCurrent(), (int) page.getSize()));
    }

    @GetMapping("/install-records")
    public Result<List<InstallRecordVO>> installRecords(@RequestParam Long skillId) {
        return success(skillQueryService.listInstallRecords(skillId));
    }
}
