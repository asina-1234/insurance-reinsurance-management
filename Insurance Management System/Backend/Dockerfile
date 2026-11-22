FROM eclipse-temurin:25-jdk AS build
WORKDIR /app
COPY mirror.gradle /root/.gradle/init.d/mirror.gradle
COPY . .
RUN chmod +x gradlew && for i in 1 2 3 4 5 6 7 8; do ./gradlew bootJar -x test --no-daemon && break || (echo "Retry $i" && sleep 30); done
RUN cp build/libs/*-SNAPSHOT.jar /app/app.jar

FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /app/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Xmx350m", "-jar", "app.jar"]