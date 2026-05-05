package com.gagentmanager.adapter.model;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gagentmanager.adapter.common.BaseController;
import com.gagentmanager.application.model.ModelQueryService;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.model.*;
import com.gagentmanager.facade.common.PageResult;
import com.gagentmanager.facade.common.Result;
import org.springframework.web.bind.annotation.*;

/** 模型管理端 Query REST 接口，处理模型的查询请求 */
@RestController
@RequestMapping("/api/model/query")
public class ModelQueryController extends BaseController {

    private final ModelQueryService modelQueryService;

    public ModelQueryController(ModelQueryService modelQueryService) {
        this.modelQueryService = modelQueryService;
    }

    @GetMapping("/get")
    public Result<ModelVO> get(@RequestParam Long id) {
        return success(modelQueryService.getModelById(id));
    }

    @GetMapping("/detail")
    public Result<ModelVO> detail(@RequestParam String num) {
        return success(modelQueryService.getModelByNum(num));
    }

    @GetMapping("/list")
    public Result<PageResult<ModelVO>> list(PageParam pageParam, String keyword, String provider, String status) {
        IPage<ModelVO> page = modelQueryService.listModels(pageParam, keyword, provider, status);
        return success(PageResult.of(page.getRecords(), page.getTotal(), (int) page.getCurrent(), (int) page.getSize()));
    }
}
