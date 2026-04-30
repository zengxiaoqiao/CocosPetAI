import { Button, director, Label, Node, sys } from 'cc';
import { getNativeAppVersionName } from './AppVersion';
import {
    LEGAL_PRIVACY_URL,
    LEGAL_TERMS_URL,
    getSettingsListNotification,
    getSettingsListPrivacy,
    getSettingsListTerms,
    getSettingsVersionPrefix,
} from './SettingsCopy';

const SETTINGS_LEGAL_BOUND = '_settingsLegalUrlBound';

function bindLegalUrlRow(row: Node | null, url: string): void {
    if (!row || (row as any)[SETTINGS_LEGAL_BOUND]) return;
    const btn = row.getComponent(Button);
    if (!btn) return;
    (row as any)[SETTINGS_LEGAL_BOUND] = true;
    btn.node.on(Button.EventType.CLICK, () => {
        sys.openURL(url);
    });
}

/**
 * 设置场景加载后调用：版本号追加到 version 节点；三条列表多语言。
 */
export function applySettingsSceneLocale(): void {
    const scene = director.getScene();
    if (!scene || scene.name !== 'settings') return;

    const canvas = scene.getChildByName('Canvas');
    if (!canvas) return;

    const verNode = canvas.getChildByName('version');
    const verLabel = verNode?.getComponent(Label);
    if (verLabel) {
        const v = getNativeAppVersionName().trim();
        verLabel.string = getSettingsVersionPrefix() + (v || '—');
    }

    const setRow = (rowName: string, text: string) => {
        const row = canvas.getChildByName(rowName);
        if (!row) return;
        const labNode = row.getChildByName('Label');
        const lab = labNode?.getComponent(Label);
        if (lab) lab.string = text;
    };

    setRow('list-notification', getSettingsListNotification());
    setRow('list-privacy', getSettingsListPrivacy());
    setRow('list-terms', getSettingsListTerms());

    bindLegalUrlRow(canvas.getChildByName('list-privacy'), LEGAL_PRIVACY_URL);
    bindLegalUrlRow(canvas.getChildByName('list-terms'), LEGAL_TERMS_URL);
}
