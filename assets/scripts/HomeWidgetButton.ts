import { _decorator, Component } from 'cc';
import { requestPinPetWidget } from './WidgetSync';

const { ccclass } = _decorator;

/**
 * 首页「Widget」按钮点击脚本：
 * - 挂在 home 场景里的那个 widget 按钮节点上
 * - 按钮的 Click 事件指向 onClickWidgetButton
 */
@ccclass('HomeWidgetButton')
export class HomeWidgetButton extends Component {

    public onClickWidgetButton() {
        requestPinPetWidget();
    }
}

