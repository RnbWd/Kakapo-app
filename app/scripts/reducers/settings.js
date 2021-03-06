import { identity } from 'ramda';
import kakapoAssets from 'kakapo-assets';
import { bridgedSettings } from 'kakapoBridge';
import { settingTypes } from 'actions/';
import { createReducer, flatteni18n } from 'utils/';

export let initialState = ['mute', 'lang'].reduce(
  (acc, k) => ({ ...acc, [k]: bridgedSettings.getItem(k) }),
  {
    intlData: {
      ...kakapoAssets.i18n.en,
      messages: flatteni18n(kakapoAssets.i18n.en.messages)
    },
    updateStatus: false
  }
);

/* istanbul ignore if */
if (__DESKTOP__) {
  initialState = {
    ...initialState,
    dockIcon: bridgedSettings.getItem('dockIcon'),
    devTools: bridgedSettings.getItem('devTools')
  };
}

const settingReducers = {
  settingsMute(state) {
    const mute = bridgedSettings.getItem('mute');
    bridgedSettings.setItem('mute', !mute);
    return { ...state, mute: !mute };
  },
  settingsDock(state, { bool }) {
    bridgedSettings.setItem('dockIcon', bool);
    return { ...state, dockIcon: bool };
  },
  settingsDevtools(state, { bool }) {
    bridgedSettings.setItem('devTools', bool);
    return { ...state, devTools: bool };
  },
  settingsUpdate(state, { status }) {
    bridgedSettings.setItem('updateStatus', status);
    return { ...state, updateStatus: status };
  }
};

export default createReducer(initialState, {
  [settingTypes.LANGUAGE]: identity,
  [settingTypes.MUTE]: settingReducers.settingsMute,
  [settingTypes.DOCK]: settingReducers.settingsDock,
  [settingTypes.DEVTOOLS]: settingReducers.settingsDevtools,
  [settingTypes.UPDATE]: settingReducers.settingsUpdate
});
