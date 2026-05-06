cmake_minimum_required(VERSION 3.8)

option(APP_NAME "Project Name" "PetAI")
project(${APP_NAME} CXX)
set(CC_LIB_NAME cocos)
set(CC_PROJECT_DIR ${CMAKE_CURRENT_LIST_DIR})
set(CC_PROJ_SOURCES)
set(CC_COMMON_SOURCES)
set(CC_ALL_SOURCES)

include(${CMAKE_CURRENT_LIST_DIR}/../common/CMakeLists.txt)

cc_android_before_target(${CC_LIB_NAME})
add_library(${CC_LIB_NAME} SHARED ${CC_ALL_SOURCES})

if(ANDROID)
    # Ensure produced native library is compatible with 16 KB memory page size devices.
    target_link_options(${CC_LIB_NAME} PRIVATE
        "-Wl,-z,common-page-size=16384"
        "-Wl,-z,max-page-size=16384"
    )
endif()

cc_android_after_target(${CC_LIB_NAME})
