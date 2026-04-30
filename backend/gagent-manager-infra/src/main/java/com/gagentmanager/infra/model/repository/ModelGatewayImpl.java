package com.gagentmanager.infra.model.repository;

import com.gagentmanager.domain.model.Model;
import com.gagentmanager.domain.model.ModelGateway;
import org.springframework.stereotype.Repository;

/** 模型网关实现，当前为 TODO 桩，待 Spring AI ChatClient 集成后实现 */
@Repository
public class ModelGatewayImpl implements ModelGateway {

    @Override
    public TestResult testConnectivity(Model model) {
        // TODO: Implement with Spring AI ChatClient
        return new TestResult(true, 0L, null);
    }
}
