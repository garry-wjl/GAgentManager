package com.gagentmanager.domain.prompt;

import java.util.List;

/** Prompt 模板仓储接口 */
public interface PromptRepository {
    List<PromptTemplate> listEnabled();
}
