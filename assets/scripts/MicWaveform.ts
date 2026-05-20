import { _decorator, Component, Graphics, UITransform, Color, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 麦克风录音态：用 Graphics 动态绘制竖条波形（不依赖贴图）。
 */
@ccclass('MicWaveform')
export class MicWaveform extends Component {

    @property({ tooltip: '竖条数量' })
    barCount: number = 9;

    @property({ tooltip: '单条宽度（px）' })
    barWidth: number = 7;

    @property({ tooltip: '条间距（px）' })
    barGap: number = 6;

    @property({ tooltip: '最大条高（px）' })
    maxBarHeight: number = 40;

    @property({ tooltip: '最小条高（px）' })
    minBarHeight: number = 8;

    @property({ tooltip: '竖条填充色' })
    barColor: Color = new Color(255, 255, 255, 255);

    private _graphics: Graphics | null = null;
    private _running = false;
    private _subdued = false;
    private _phase = 0;
    private _heights: number[] = [];
    private _targets: number[] = [];
    private _recordImgNode: Node | null = null;

    onLoad() {
        this._graphics = this.getComponent(Graphics) || this.addComponent(Graphics);
        const uit = this.getComponent(UITransform) || this.addComponent(UITransform);
        const totalW = this.barCount * this.barWidth + Math.max(0, this.barCount - 1) * this.barGap;
        uit.setContentSize(totalW, this.maxBarHeight);
        this._heights = new Array(this.barCount).fill(this.minBarHeight);
        this._targets = this._heights.slice();
        this._hideLegacySprite();
    }

    /** 开始/停止波形动画；subdued=true 时幅度较小（按住未正式录音） */
    public setAnimating(on: boolean, subdued = false) {
        this._running = on;
        this._subdued = subdued;
        this.node.active = on;
        if (on) {
            this._hideLegacySprite();
            this._phase = 0;
        } else {
            this._graphics?.clear();
        }
    }

    public get isAnimating(): boolean {
        return this._running;
    }

    update(dt: number) {
        if (!this._running || !this._graphics) return;

        const speed = this._subdued ? 5.5 : 9;
        const amp = this._subdued ? 0.45 : 1;
        this._phase += dt * speed;

        const range = (this.maxBarHeight - this.minBarHeight) * amp;
        for (let i = 0; i < this.barCount; i++) {
            const wobble =
                0.32 +
                0.38 * Math.abs(Math.sin(this._phase * 2.1 + i * 0.78)) +
                0.3 * Math.abs(Math.sin(this._phase * 3.7 + i * 1.35 + 0.4));
            this._targets[i] = this.minBarHeight + range * Math.min(1, wobble);
            const smooth = this._subdued ? 10 : 14;
            this._heights[i] += (this._targets[i] - this._heights[i]) * Math.min(1, dt * smooth);
        }
        this._draw();
    }

    private _draw() {
        const g = this._graphics!;
        g.clear();
        g.fillColor = this.barColor;

        const totalW = this.barCount * this.barWidth + Math.max(0, this.barCount - 1) * this.barGap;
        const startX = -totalW * 0.5;
        const radius = Math.max(2, this.barWidth * 0.45);

        for (let i = 0; i < this.barCount; i++) {
            const h = this._heights[i];
            const x = startX + i * (this.barWidth + this.barGap);
            const y = -h * 0.5;
            g.roundRect(x, y, this.barWidth, h, radius);
            g.fill();
        }
    }

    private _hideLegacySprite() {
        if (!this._recordImgNode && this.node.parent) {
            this._recordImgNode = this.node.parent.getChildByName('record-img');
        }
        if (this._recordImgNode) {
            this._recordImgNode.active = false;
        }
    }
}
