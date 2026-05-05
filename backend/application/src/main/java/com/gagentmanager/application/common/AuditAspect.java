package com.gagentmanager.application.common;

import com.gagentmanager.domain.audit.AuditLog;
import com.gagentmanager.domain.audit.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/** 审计切面，自动拦截所有 Controller 的 POST 请求并记录操作日志，通过方法名前缀推断操作类型和资源类型 */
@Configuration
@Aspect
public class AuditAspect {

    private static final Logger log = LoggerFactory.getLogger(AuditAspect.class);
    private final AuditLogRepository auditLogRepository;

    public AuditAspect(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Around("execution(* com.gagentmanager.adapter..*Controller.*(..)) && @annotation(org.springframework.web.bind.annotation.PostMapping)")
    public Object auditWrite(ProceedingJoinPoint joinPoint) throws Throwable {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            return joinPoint.proceed();
        }

        HttpServletRequest request = attrs.getRequest();
        String action = extractAction(joinPoint);
        String resourceType = extractResourceType(joinPoint);
        Long operatorId = extractOperatorId(request);
        String operatorName = (String) request.getAttribute("username");
        String ip = request.getRemoteAddr();
        String ua = request.getHeader("User-Agent");

        Object result = null;
        String resultStatus = "SUCCESS";
        String errorMsg = null;
        try {
            result = joinPoint.proceed();
            return result;
        } catch (Throwable e) {
            resultStatus = "FAIL";
            errorMsg = e.getMessage();
            throw e;
        } finally {
            try {
                AuditLog auditLog = AuditLog.create(
                        operatorId, operatorName, resourceType, null, action,
                        null, ip, ua, resultStatus, errorMsg);
                auditLogRepository.save(auditLog);
            } catch (Exception ex) {
                log.warn("Failed to write audit log", ex);
            }
        }
    }

    private String extractAction(ProceedingJoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        if (methodName.startsWith("create")) return "CREATE";
        if (methodName.startsWith("update")) return "UPDATE";
        if (methodName.startsWith("delete")) return "DELETE";
        if (methodName.startsWith("enable")) return "ENABLE";
        if (methodName.startsWith("disable")) return "DISABLE";
        if (methodName.startsWith("publish")) return "PUBLISH";
        if (methodName.startsWith("deploy")) return "DEPLOY";
        if (methodName.startsWith("start")) return "START";
        if (methodName.startsWith("stop")) return "STOP";
        if (methodName.startsWith("rollback")) return "ROLLBACK";
        if (methodName.startsWith("bind")) return "BIND";
        if (methodName.startsWith("unbind")) return "UNBIND";
        if (methodName.startsWith("assign")) return "ASSIGN";
        if (methodName.startsWith("remove")) return "REMOVE";
        if (methodName.startsWith("install")) return "INSTALL";
        if (methodName.startsWith("uninstall")) return "UNINSTALL";
        if (methodName.startsWith("review")) return "REVIEW";
        if (methodName.startsWith("test")) return "TEST";
        if (methodName.startsWith("send")) return "SEND";
        if (methodName.startsWith("rename")) return "RENAME";
        if (methodName.startsWith("change")) return "CHANGE";
        if (methodName.startsWith("toggle")) return "TOGGLE";
        if (methodName.startsWith("set")) return "SET";
        if (methodName.startsWith("mark")) return "MARK";
        if (methodName.startsWith("upload")) return "UPLOAD";
        return methodName.toUpperCase();
    }

    private String extractResourceType(ProceedingJoinPoint joinPoint) {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        if (className.contains("Agent")) return "AGENT";
        if (className.contains("User")) return "USER";
        if (className.contains("Model")) return "MODEL";
        if (className.contains("Role") || className.contains("Rbac")) return "RBAC";
        if (className.contains("Skill")) return "SKILL";
        if (className.contains("Mcp")) return "MCP";
        if (className.contains("Workflow")) return "WORKFLOW";
        if (className.contains("SystemConfig")) return "SYSTEM_CONFIG";
        if (className.contains("Home")) return "HOME";
        if (className.contains("Chat")) return "CHAT";
        if (className.contains("Auth")) return "AUTH";
        return "UNKNOWN";
    }

    private Long extractOperatorId(HttpServletRequest request) {
        Object userId = request.getAttribute("userId");
        if (userId instanceof Long) return (Long) userId;
        if (userId instanceof Number) return ((Number) userId).longValue();
        return 0L;
    }
}
