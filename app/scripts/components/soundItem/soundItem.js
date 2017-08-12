import React from 'react';
import { Subject } from 'rxjs/Subject';
import { prop } from 'ramda';
import { soundActions } from 'actions/';
import { cx, handleStopPropagation, openLink } from 'utils/';
import './soundItem.css';

function observeThrottleVolume(dispatch, sound) {
  const subject = new Subject().throttleTime(500).distinctUntilChanged();

  subject.subscribe({
    next: _s => dispatch(soundActions.volume(sound, _s))
  });

  return subject;
}

export default ({ sound, themes, dispatch }) => {
  const subject = observeThrottleVolume(dispatch, sound);

  const handleToggle = () => dispatch(soundActions.play(sound));

  const handleDelete = el => {
    handleStopPropagation(el);
    dispatch(soundActions.remove(sound));
  };

  const handleEdit = el => {
    handleStopPropagation(el);
    dispatch(soundActions.edit(sound));
  };

  const renderActions = () =>
    <ul className={cx('actions', { dark: !sound.playing })}>
      {sound.link
        ? <li>
            <a
              href={sound.link}
              onClick={e => openLink(e, sound.link)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <i className="icon-share" />
            </a>
          </li>
        : ''}
      {sound.source !== 'youtubeStream'
        ? <li onClick={handleEdit}>
            <i className="icon-edit" />
          </li>
        : ''}
      <li onClick={handleDelete}>
        <i className="icon-delete" />
      </li>
    </ul>;

  let objStyle = { color: '#121212' };
  if (sound.playing) {
    objStyle = {
      ...objStyle,
      backgroundColor: prop('primary', themes),
      color: '#fff'
    };
  }

  let icon;
  if (sound.source === 'file') {
    icon = <i className={cx('preview', `icon-${sound.img}`)} />;
  } else {
    icon = sound.img
      ? <img src={sound.img} alt={sound.name} />
      : <div className="no-image" />;
  }

  return (
    <div
      onClick={handleToggle}
      style={objStyle}
      role="button"
      tabIndex={-1}
      className={cx('item', 'waves-effect', 'waves-block', {
        playing: sound.playing,
        paused: !sound.playing,
        'youtube-stream': sound.source === 'youtubeStream'
      })}
    >
      <div className="inner">
        {icon}
        {renderActions()}
        <span className="title">
          {sound.name}
        </span>
        <input
          defaultValue={sound.volume}
          max="1"
          min="0"
          step="0.01"
          type="range"
          onChange={({ target }) => subject.next(parseFloat(target.value))}
          onClick={handleStopPropagation}
        />
      </div>
      {sound.source === 'youtubeStream'
        ? <div className="youtube-video" id={`video-${sound.file}`} />
        : <div />}
    </div>
  );
};
