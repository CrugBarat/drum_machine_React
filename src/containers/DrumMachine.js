import React, {Component, Fragment} from 'react';
import './DrumMachine.css';
import Tone from 'tone';
import BPMSlider from '../components/BPMSlider';
import SwingSlider from '../components/SwingSlider';
import GainSlider from '../components/GainSlider';
import DelaySlider from '../components/DelaySlider';
import SampleSelect from '../components/SampleSelect';
import kick from '../assets/sounds/kick.wav';
import hat from '../assets/sounds/hat.wav';
import snare from '../assets/sounds/snare.wav';
import tom from '../assets/sounds/tom.wav';

class DrumMachine extends Component {
  constructor() {
    super();

    this.state = {
      samples: [[{"E5": hat}], [{"E2": tom}], [{"E3": snare}], [{"E1": kick}]],
      sampler: new Tone.Sampler({"E1": kick, "E3": snare, "E5": hat, "E2": tom}),
      rows: document.body.querySelectorAll('div > div'),
      index: 0,
      bpm: 120,
      swing: 0.0,
      gain: 1.0,
      delay: 0.0,
      eventID: 0,
      playing: false,
      recDest: Tone.context.createMediaStreamDestination(),
      recorder: null,
      recording: false,
      sampleChoices: ['808'],
      kit: '808'
    }

    this.getRows = this.getRows.bind(this);
    this.startDrumMachine = this.startDrumMachine.bind(this);
    this.stopDrumMachine = this.stopDrumMachine.bind(this);
    this.stopMedia = this.stopMedia.bind(this);
    this.repeat = this.repeat.bind(this);
    this.clearDrumMachine = this.clearDrumMachine.bind(this);
    this.updateBPM = this.updateBPM.bind(this);
    this.updateSwing = this.updateSwing.bind(this);
    this.updateGain = this.updateGain.bind(this);
    this.updateDelay = this.updateDelay.bind(this);
    this.resetDelay = this.resetDelay.bind(this);
    this.recordStart = this.recordStart.bind(this);
    this.recordStop = this.recordStop.bind(this);
  }

  componentDidMount() {
    this.getRows();
  }

  getRows() {
    const rows = document.body.querySelectorAll('section > div');
    this.setState({rows: rows});
  }

  startDrumMachine() {
    if(!this.state.playing) {
      this.stopDrumMachine();
      this.state.sampler.disconnect();
      this.state.sampler.connect(this.state.recDest);
      this.state.sampler.toMaster();
      const eventID = Tone.Transport.scheduleRepeat(this.repeat, '16n');
      this.setState({eventID: eventID});
      Tone.Transport.start();
      this.setState({playing: true});
    }
  }

  stopDrumMachine() {
    Tone.Transport.stop();
    Tone.Transport.clear(this.state.eventID);
    this.setState({index: 0});
    this.setState({playing: false})
  }

  stopMedia() {
    if(this.state.recording) {
      this.recordStop();
    }
    this.stopDrumMachine();
  }

  repeat() {
    let step = this.state.index % 16;
    for (let i = 0; i < 4; i++) {
      let sample = this.state.samples[i];
      console.log(sample);
      let row = this.state.rows[i];
      let input = row.querySelector(`input:nth-child(${step + 1})`);
      if (input.checked) {
        this.state.sampler.triggerAttackRelease(Object.keys(sample[0]), '16n');
      }
    }
    this.setState({index: this.state.index + 1});
  }

  clearDrumMachine() {
    this.stopDrumMachine();
    const inputs = document.body.querySelectorAll('input');
    for(let i =0; i<inputs.length; i++) {
      inputs[i].checked = false;
    }
  }

  updateBPM(bpm) {
    this.setState({bpm: parseInt(bpm)});
    Tone.Transport.bpm.value = this.state.bpm;
  }

  updateSwing(swing) {
    this.setState({swing: parseFloat(swing)});
    Tone.Transport.swing = this.state.swing;
  }

  updateGain(gain) {
    this.state.sampler.disconnect();
    this.setState({gain: parseFloat(gain)});
    const newGain = new Tone.Gain(this.state.gain);
    newGain.toMaster();
    this.state.sampler.connect(newGain);
    this.setState({delay: 0});
  }

  updateDelay(delay) {
    this.state.sampler.disconnect();
    this.setState({delay: parseFloat(delay)});
    const pingPong = new Tone.PingPongDelay("4n", this.state.delay).toMaster();
    this.state.sampler.connect(pingPong);
  }

  resetDelay() {
    this.state.sampler.disconnect();
    this.state.sampler.toMaster();
    this.setState({delay: 0});
  }

  recordStart() {
    const recorder = new MediaRecorder(this.state.recDest.stream, {'type': 'audio/wav'});
    this.setState({recorder: recorder});
    this.setState({recording: true});
    recorder.start();
  }

  recordStop() {
    if(this.state.recorder != null) {
      this.setState({recording: false})
      this.state.recorder.stop();
      this.clearDrumMachine();
      this.setState({recorder: null});
      const recChunks = [];
      this.state.recorder.ondataavailable = evt => recChunks.push(evt.data);
      this.state.recorder.onstop = evt => {
        let blob = new Blob(recChunks, {'type': 'audio/wav'});
        const audioURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.color = 'white';
        link.style.cssText = "font-size: 20px; color: white;"
        link.href = audioURL;
        link.download = 'my_recording';
        link.innerHTML = 'DOWNLOAD FILE';
        document.body.appendChild(link);
      };
    }
  }

  render() {
    return (
      <Fragment>
        <section className="controls-container">
          <div>
            <input className="row1" type="checkbox" />
            <input className="row1" type="checkbox" />
            <input className="row1" type="checkbox" />
            <input className="row1" type="checkbox" />
            <input className="row1" type="checkbox" />
            <input className="row1" type="checkbox" />
            <input className="row1" type="checkbox" />
            <input className="row1" type="checkbox" />
            <input className="row1" type="checkbox" />
            <input className="row1" type="checkbox" />
            <input className="row1" type="checkbox" />
            <input className="row1" type="checkbox" />
            <input className="row1" type="checkbox" />
            <input className="row1" type="checkbox" />
            <input className="row1" type="checkbox" />
            <input className="row1" type="checkbox" />
          </div>
          <div>
            <input className="row2" type="checkbox" />
            <input className="row2" type="checkbox" />
            <input className="row2" type="checkbox" />
            <input className="row2" type="checkbox" />
            <input className="row2" type="checkbox" />
            <input className="row2" type="checkbox" />
            <input className="row2" type="checkbox" />
            <input className="row2" type="checkbox" />
            <input className="row2" type="checkbox" />
            <input className="row2" type="checkbox" />
            <input className="row2" type="checkbox" />
            <input className="row2" type="checkbox" />
            <input className="row2" type="checkbox" />
            <input className="row2" type="checkbox" />
            <input className="row2" type="checkbox" />
            <input className="row2" type="checkbox" />
          </div>
          <div>
            <input className="row3" type="checkbox" />
            <input className="row3" type="checkbox" />
            <input className="row3" type="checkbox" />
            <input className="row3" type="checkbox" />
            <input className="row3" type="checkbox" />
            <input className="row3" type="checkbox" />
            <input className="row3" type="checkbox" />
            <input className="row3" type="checkbox" />
            <input className="row3" type="checkbox" />
            <input className="row3" type="checkbox" />
            <input className="row3" type="checkbox" />
            <input className="row3" type="checkbox" />
            <input className="row3" type="checkbox" />
            <input className="row3" type="checkbox" />
            <input className="row3" type="checkbox" />
            <input className="row3" type="checkbox" />
          </div>
          <div>
            <input className="row4" type="checkbox" />
            <input className="row4" type="checkbox" />
            <input className="row4" type="checkbox" />
            <input className="row4" type="checkbox" />
            <input className="row4" type="checkbox" />
            <input className="row4" type="checkbox" />
            <input className="row4" type="checkbox" />
            <input className="row4" type="checkbox" />
            <input className="row4" type="checkbox" />
            <input className="row4" type="checkbox" />
            <input className="row4" type="checkbox" />
            <input className="row4" type="checkbox" />
            <input className="row4" type="checkbox" />
            <input className="row4" type="checkbox" />
            <input className="row4" type="checkbox" />
            <input className="row4" type="checkbox" />
          </div>

            <div className="values-border">
              <div className="values-container">
                <h3 className="values">{this.state.kit} <p className="units">Kit</p></h3>
                <h3 className="values">{this.state.swing} <p className="units">Swing</p></h3>
                <h3 className="values">{this.state.delay} <p className="units">Delay</p></h3>
                <h3 className="values">{this.state.gain} <p className="units">Gain</p></h3>
                <h3 className="values">{this.state.bpm} <p className="units">BPM</p></h3>
              </div>
            </div>
            <div className="media-border">
              <div className="media-controls-container">
                <p className="controls-title">CONTROLS</p>
                <div className="main-control">
                  <button name="play" onClick={this.startDrumMachine}></button>
                </div>
                  <div className="sub-controls">
                  <div>
                    <button name="record" onClick={this.recordStart}></button>
                  </div>
                  <div>
                    <button name="stop" onClick={this.stopMedia}></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="sliders-container">
              <div className="slider-value">
                <p>BPM</p>
              </div>
              <div className="slider-container">
                <BPMSlider className="bpm-slider" updateBPM={this.updateBPM} bpm={this.state.bpm}/>
              </div>
              <div className="slider-value">
                <p>SWING</p>
              </div>
              <div className="slider-container">
                <SwingSlider className="swing-slider" updateSwing={this.updateSwing} swing={this.state.swing} />
              </div>
              <div className="slider-value">
                <p>DELAY</p>
              </div>
              <div className="slider-container">
                <DelaySlider className="delay-slider" updateDelay={this.updateDelay} delay={this.state.delay} />
              </div>
              <div className="slider-value">
                <p>GAIN</p>
              </div>
              <div className="slider-container">
                <GainSlider className="gain-slider" updateGain={this.updateGain} gain={this.state.gain} />
              </div>
            </div>
            <div>
            <div className="reset-but-container">
              <button className="destroy-buttons reset-buttons" onClick={this.resetDelay}>RESET DELAY</button>
            </div>
            <div className="clear-but-container">
              <button className="destroy-buttons clear-button" onClick={this.clearDrumMachine}>CLEAR</button>
            </div>
            <div>
              <SampleSelect sampleChoices={this.state.sampleChoices}/>
            </div>
          </div>
        </section>
      </Fragment>
    )
  }
}

export default DrumMachine;
