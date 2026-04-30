package com.gagentmanager.application.skill;

import com.gagentmanager.client.skill.*;
import com.gagentmanager.domain.skill.*;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

/** Skill 写操作服务，负责 Skill 的创建/更新/删除/安装/卸载/评价 */
@Service
public class SkillCommandService {

    private final SkillRepository skillRepository;
    private final SkillVersionRepository versionRepository;
    private final SkillReviewRepository reviewRepository;
    private final SkillInstallRecordRepository installRecordRepository;

    public SkillCommandService(SkillRepository skillRepository, SkillVersionRepository versionRepository,
                               SkillReviewRepository reviewRepository, SkillInstallRecordRepository installRecordRepository) {
        this.skillRepository = skillRepository;
        this.versionRepository = versionRepository;
        this.reviewRepository = reviewRepository;
        this.installRecordRepository = installRecordRepository;
    }

    public SkillVO createSkill(CreateSkillParam param, Long operatorId) {
        Skill existing = skillRepository.findByCode(param.getSkillCode());
        if (existing != null) {
            throw new BusinessException(ErrorCode.SKILL_CODE_ALREADY_EXISTS);
        }
        Skill skill = new Skill();
        BeanUtils.copyProperties(param, skill);
        skill.save(operatorId);
        skillRepository.save(skill, operatorId);
        return toSkillVO(skill);
    }

    public void updateSkill(UpdateSkillParam param, Long operatorId) {
        Skill skill = skillRepository.findById(param.getId());
        if (skill == null) {
            throw new BusinessException(ErrorCode.SKILL_NOT_FOUND);
        }
        BeanUtils.copyProperties(param, skill, "id", "skillCode");
        skill.setUpdateNo(String.valueOf(operatorId));
        skillRepository.save(skill, operatorId);
    }

    public void deleteSkill(String num, Long operatorId) {
        Skill skill = skillRepository.findByNum(num);
        if (skill == null) {
            throw new BusinessException(ErrorCode.SKILL_NOT_FOUND);
        }
        skill.delete(operatorId);
        skillRepository.delete(num, operatorId);
    }

    public void installSkill(String skillNum, Long userId) {
        Skill skill = skillRepository.findByNum(skillNum);
        if (skill == null) {
            throw new BusinessException(ErrorCode.SKILL_NOT_FOUND);
        }
        if (reviewRepository.existsBySkillIdAndUserId(skill.getId(), userId)) {
            return;
        }
        SkillInstallRecord record = SkillInstallRecord.create(
                skill.getId(), skill.getSkillName(), skill.getVersion(), String.valueOf(userId));
        record.markSuccess();
        installRecordRepository.save(record);

        skillRepository.incrementInstallCount(skill.getId());
        skill.incrementInstallCount();
    }

    public void uninstallSkill(String skillNum, Long userId) {
        SkillInstallRecord record = installRecordRepository.findBySkillAndUser(
                skillRepository.findByNum(skillNum).getId(), userId);
        if (record != null) {
            record.uninstall();
            installRecordRepository.save(record);
        }
    }

    public void reviewSkill(SkillReviewParam param, Long userId) {
        Skill skill = skillRepository.findByCode(param.getSkillNum());
        if (skill == null) {
            throw new BusinessException(ErrorCode.SKILL_NOT_FOUND);
        }
        if (reviewRepository.existsBySkillIdAndUserId(skill.getId(), userId)) {
            throw new BusinessException(ErrorCode.SKILL_REVIEW_ALREADY_EXISTS);
        }
        SkillReview review = SkillReview.create(skill.getId(), userId, String.valueOf(userId), param.getRating(), param.getContent());
        reviewRepository.save(review);
    }

    private SkillVO toSkillVO(Skill s) {
        SkillVO vo = new SkillVO();
        BeanUtils.copyProperties(s, vo);
        return vo;
    }
}
