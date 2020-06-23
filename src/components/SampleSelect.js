import React from 'react';
import './Component.css';

const SampleSelect = (props) => {
  const options = props.sampleChoices.map((sample, index) => {
      return <option key={index} value={sample.name}>{sample}</option>
  });

  function handleChange(ev) {
    props.onSampleSelect(ev.target.value);
  }

  return (
    <select className="sample-select" onChange={handleChange} defaultValue="default">
      <option value="default" disabled>Kits</option>
      {options}
    </select>
  )
}

export default SampleSelect;
