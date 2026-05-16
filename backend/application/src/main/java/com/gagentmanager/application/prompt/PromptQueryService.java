package com.gagentmanager.application.prompt;

import com.gagentmanager.client.prompt.PromptTemplateVO;
import com.gagentmanager.domain.prompt.PromptRepository;
import com.gagentmanager.domain.prompt.PromptTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/** Prompt 推荐查询服务 */
@Service
public class PromptQueryService {

    private final PromptRepository promptRepository;

    public PromptQueryService(PromptRepository promptRepository) {
        this.promptRepository = promptRepository;
    }

    public List<PromptTemplateVO> listEnabledPrompts() {
        List<PromptTemplate> templates = promptRepository.listEnabled();
        return templates.stream().map(this::toVO).collect(Collectors.toList());
    }

    private PromptTemplateVO toVO(PromptTemplate t) {
        PromptTemplateVO vo = new PromptTemplateVO();
        vo.setNum(t.getNum());
        vo.setTitle(t.getTitle());
        vo.setContent(t.getContent());
        vo.setCategory(t.getCategory());
        vo.setIcon(t.getIcon());
        return vo;
    }
}
