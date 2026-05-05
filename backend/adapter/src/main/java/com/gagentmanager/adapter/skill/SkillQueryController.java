package com.gagentmanager.adapter.skill;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.skill.SkillQueryService;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.skill.*;
import com.gagentmanager.facade.common.PageResult;
import com.gagentmanager.facade.common.Result;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Skill 管理端 Query REST 接口，处理 Skill 的查询请求 */
@RestController
@RequestMapping("/api/skill/query")
public class SkillQueryController extends BaseController {

    private final SkillQueryService skillQueryService;

    public SkillQueryController(SkillQueryService skillQueryService) {
        this.skillQueryService = skillQueryService;
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
