#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface PetNativeASR : NSObject
+ (void)startAutoAsr;
+ (void)stopAutoAsr;
+ (NSString *)pollAutoAsrResult;
+ (NSString *)getAppVersionName;
@end

NS_ASSUME_NONNULL_END

