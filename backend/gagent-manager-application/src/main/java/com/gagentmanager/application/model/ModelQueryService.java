package com.gagentmanager.application.model;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.model.ModelVO;
import com.gagentmanager.domain.model.Model;
import com.gagentmanager.domain.model.ModelRepository;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

/** 模型查询服务，提供模型列表/详情查询 */
@Service
public class ModelQueryService {

    private final ModelRepository modelRepository;

    public ModelQueryService(ModelRepository modelRepository) {
        this.modelRepository = modelRepository;
    }

    public ModelVO getModelById(Long id) {
        Model model = modelRepository.findById(id);
        if (model == null) {
            throw new BusinessException(ErrorCode.MODEL_NOT_FOUND);
        }
        return toVO(model);
    }

    public ModelVO getModelByNum(String num) {
        Model model = modelRepository.findByNum(num);
        if (model == null) {
            throw new BusinessException(ErrorCode.MODEL_NOT_FOUND);
        }
        return toVO(model);
    }

    public IPage<ModelVO> listModels(PageParam pageParam, String keyword, String provider, String status) {
        Page<Model> page = new Page<>(pageParam.getPageNo(), pageParam.getPageSize());
        IPage<Model> modelPage = modelRepository.list(page, keyword, provider, status);
        return modelPage.convert(this::toVO);
    }

    private ModelVO toVO(Model m) {
        ModelVO vo = new ModelVO();
        BeanUtils.copyProperties(m, vo);
        return vo;
    }
}
