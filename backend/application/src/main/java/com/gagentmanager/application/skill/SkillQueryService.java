package com.gagentmanager.application.skill;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gagentmanager.client.common.PageParam;
import com.gagentmanager.client.skill.*;
import com.gagentmanager.domain.skill.*;
import com.gagentmanager.facade.common.BusinessException;
import com.gagentmanager.facade.common.ErrorCode;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/** Skill 查询服务，提供 Skill 列表/详情/版本/评价/安装记录查询 */
@Service
public class SkillQueryService {

    private final SkillRepository skillRepository;
    private final SkillVersionRepository versionRepository;
    private final SkillReviewRepository reviewRepository;
    private final SkillInstallRecordRepository installRecordRepository;

    public SkillQueryService(SkillRepository skillRepository, SkillVersionRepository versionRepository,
                             SkillReviewRepository reviewRepository, SkillInstallRecordRepository installRecordRepository) {
        this.skillRepository = skillRepository;
        this.versionRepository = versionRepository;
        this.reviewRepository = reviewRepository;
        this.installRecordRepository = installRecordRepository;
    }

    public SkillVO getSkillById(Long id) {
        Skill skill = skillRepository.findById(id);
        if (skill == null) {
            throw new BusinessException(ErrorCode.SKILL_NOT_FOUND);
        }
        return toSkillVO(skill);
    }

    public SkillVO getSkillByNum(String num) {
        Skill skill = skillRepository.findByNum(num);
        if (skill == null) {
            throw new BusinessException(ErrorCode.SKILL_NOT_FOUND);
        }
        return toSkillVO(skill);
    }

    public IPage<SkillVO> listSkills(PageParam pageParam, String keyword, String category, String status) {
        Page<Skill> page = new Page<>(pageParam.getPageNo(), pageParam.getPageSize());
        IPage<Skill> skillPage = skillRepository.list(page, keyword, category, status);
        return skillPage.convert(this::toSkillVO);
    }

    public List<SkillVersionVO> listVersions(String skillNum) {
        Skill skill = skillRepository.findByNum(skillNum);
        if (skill == null) {
            throw new BusinessException(ErrorCode.SKILL_NOT_FOUND);
        }
        List<SkillVersion> versions = versionRepository.findBySkillId(skill.getId());
        return versions.stream().map(this::toVersionVO).collect(Collectors.toList());
    }

    public IPage<SkillReviewVO> listReviews(PageParam pageParam, String skillNum) {
        Skill skill = skillRepository.findByNum(skillNum);
        if (skill == null) {
            throw new BusinessException(ErrorCode.SKILL_NOT_FOUND);
        }
        Page<SkillReview> page = new Page<>(pageParam.getPageNo(), pageParam.getPageSize());
        IPage<SkillReview> reviewPage = reviewRepository.findBySkillId(page, skill.getId());
        return reviewPage.convert(this::toReviewVO);
    }

    public List<InstallRecordVO> listInstallRecords(Long skillId) {
        List<SkillInstallRecord> records = installRecordRepository.findBySkillId(skillId);
        return records.stream().map(this::toInstallRecordVO).collect(Collectors.toList());
    }

    private SkillVO toSkillVO(Skill s) {
        SkillVO vo = new SkillVO();
        BeanUtils.copyProperties(s, vo);
        return vo;
    }

    private SkillVersionVO toVersionVO(SkillVersion v) {
        SkillVersionVO vo = new SkillVersionVO();
        vo.setNum(v.getNum());
        vo.setVersion(v.getVersion());
        vo.setVersionTag(v.getVersionTag());
        vo.setChangelog(v.getChangelog());
        vo.setCreator(v.getCreator());
        vo.setPublishTime(v.getPublishTime());
        vo.setCreateTime(v.getCreateTime());
        return vo;
    }

    private SkillReviewVO toReviewVO(SkillReview r) {
        SkillReviewVO vo = new SkillReviewVO();
        vo.setNum(r.getNum());
        vo.setSkillId(r.getSkillId());
        vo.setUsername(r.getUsername());
        vo.setRating(r.getRating());
        vo.setContent(r.getContent());
        vo.setIsVerified(r.getIsVerified());
        vo.setReplyCount(r.getReplyCount());
        vo.setCreateTime(r.getCreateTime());
        return vo;
    }

    private InstallRecordVO toInstallRecordVO(SkillInstallRecord r) {
        InstallRecordVO vo = new InstallRecordVO();
        vo.setNum(r.getNum());
        vo.setSkillId(r.getSkillId());
        vo.setSkillName(r.getSkillName());
        vo.setInstalledVersion(r.getInstalledVersion());
        vo.setInstallStatus(r.getInstallStatus());
        vo.setInstallUser(r.getInstallUser());
        vo.setInstallTime(r.getInstallTime());
        vo.setFailReason(r.getFailReason());
        return vo;
    }
}
