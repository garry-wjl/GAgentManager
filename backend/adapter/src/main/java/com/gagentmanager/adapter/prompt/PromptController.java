package com.gagentmanager.adapter.prompt;

import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.prompt.PromptQueryService;
import com.gagentmanager.client.prompt.PromptTemplateVO;
import com.gagentmanager.facade.common.Result;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Prompt 推荐查询控制器 */
@RestController
@RequestMapping("/api/prompt")
public class PromptController extends BaseController {

    private final PromptQueryService promptQueryService;

    public PromptController(PromptQueryService promptQueryService) {
        this.promptQueryService = promptQueryService;
    }

    @GetMapping("/list")
    public Result<List<PromptTemplateVO>> listPrompts() {
        return success(promptQueryService.listEnabledPrompts());
    }
}
