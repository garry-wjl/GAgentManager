package com.gagentmanager;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/** GAgentManager 应用启动类，配置 Spring Boot 组件扫描范围和 MyBatis Mapper 扫描路径 */
@SpringBootApplication(scanBasePackages = "com.gagentmanager")
@MapperScan("com.gagentmanager.infra.**.mapper")
public class GAgentManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(GAgentManagerApplication.class, args);
    }
}
