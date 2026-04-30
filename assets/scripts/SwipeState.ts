/**
 * 滑动状态：PetButtons 触发滑动动画时置 true，
 * PetControllerBase.onBtn0Click 检查后跳过本次点击，避免滑动误触点击。
 */
export const SwipeState = {
    ignoreNextBtn0Click: false,
};
