package com.gagentmanager.application.model;

import com.gagentmanager.client.model.*;
import com.gagentmanager.domain.model.Model;
import com.gagentmanager.domain.model.ModelGateway;
import com.gagentmanager.domain.model.ModelRepository;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import com.gagentmanager.infra.common.AesEncryptor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

/** 模型写操作服务，负责模型的创建/更新/删除/启停/连通性测试，API Key 使用 AES 加密存储 */
@Service
public class ModelCommandService {

    private final ModelRepository modelRepository;
    private final ModelGateway modelGateway;

    public ModelCommandService(ModelRepository modelRepository, ModelGateway modelGateway) {
        this.modelRepository = modelRepository;
        this.modelGateway = modelGateway;
    }

    public ModelVO createModel(CreateModelParam param, Long operatorId) {
        Model existing = modelRepository.findByCode(param.getModelCode());
        if (existing != null) {
            throw new BusinessException(ErrorCode.MODEL_CODE_ALREADY_EXISTS);
        }
        Model model = new Model();
        BeanUtils.copyProperties(param, model);
        model.setApiKey(AesEncryptor.encrypt(param.getApiKey()));
        model.save(operatorId);
        modelRepository.save(model, operatorId);
        return toVO(model);
    }

    public void updateModel(UpdateModelParam param, Long operatorId) {
        Model model = modelRepository.findById(param.getId());
        if (model == null) {
            throw new BusinessException(ErrorCode.MODEL_NOT_FOUND);
        }
        if (param.getApiKey() != null) {
            model.setApiKey(AesEncryptor.encrypt(param.getApiKey()));
        }
        BeanUtils.copyProperties(param, model, "id", "modelCode");
        model.setUpdateNo(String.valueOf(operatorId));
        modelRepository.save(model, operatorId);
    }

    public void deleteModel(String num, Long operatorId) {
        Model model = modelRepository.findByNum(num);
        if (model == null) {
            throw new BusinessException(ErrorCode.MODEL_NOT_FOUND);
        }
        model.delete(operatorId);
        modelRepository.delete(num, operatorId);
    }

    public void enableModel(String num, Long operatorId) {
        Model model = modelRepository.findByNum(num);
        if (model == null) {
            throw new BusinessException(ErrorCode.MODEL_NOT_FOUND);
        }
        model.enable(operatorId);
        modelRepository.save(model, operatorId);
    }

    public void disableModel(String num, Long operatorId) {
        Model model = modelRepository.findByNum(num);
        if (model == null) {
            throw new BusinessException(ErrorCode.MODEL_NOT_FOUND);
        }
        model.disable(operatorId);
        modelRepository.save(model, operatorId);
    }

    public TestResultVO testConnectivity(String num) {
        Model model = modelRepository.findByNum(num);
        if (model == null) {
            throw new BusinessException(ErrorCode.MODEL_NOT_FOUND);
        }
        ModelGateway.TestResult result = modelGateway.testConnectivity(model);
        model.recordTestResult(result.isSuccess(), result.getResponseTime(), result.getErrorMessage());
        modelRepository.save(model, model.getId());
        return toTestResultVO(result);
    }

    private ModelVO toVO(Model m) {
        ModelVO vo = new ModelVO();
        BeanUtils.copyProperties(m, vo);
        return vo;
    }

    private TestResultVO toTestResultVO(ModelGateway.TestResult r) {
        TestResultVO vo = new TestResultVO();
        vo.setSuccess(r.isSuccess());
        vo.setResponseTime(r.getResponseTime());
        vo.setErrorMessage(r.getErrorMessage());
        return vo;
    }
}
