# Dapper Mapper

A wrapper around Map for hashing complex object keys by value. This allows you to reference the same Map value using objects that are deep equal but not referentially equal.

## Installation

```bash
yarn add dapper-mapper
```

## Usage

## Benchmark Results
As expected, this library comes with performance tradeoffs, so if your main goal is performance over efficiency, this likely isn't the right approach, especially when you are processing a large amount of data.


#### 1,000 Iterations

<div style="display: flex; flex-wrap: wrap; gap: 20px;">
  <div style="flex: 1; min-width: 400px; max-width: 600px;">
    <h5>Key Type: Object</h5>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Operation</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">DapperMapper (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Map (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Overhead (ms)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">set</td>
                <td style="border: 1px solid #ddd; padding: 8px;">5.73</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.34</td>
                <td style="border: 1px solid #ddd; padding: 8px;">5.39</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">get</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.67</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.22</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.45</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">has</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.54</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.14</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.4</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">delete</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.52</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.12</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.4</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">Size</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">Clear</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
              </tr>
      </tbody>
    </table>
  </div>
  <div style="flex: 1; min-width: 300px; max-width: 600px;">
    <h5>Key Type: String (1,000 iterations)</h5>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Operation</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">DapperMapper (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Map (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Overhead (ms)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">set</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.31</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.24</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.07</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">get</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.18</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.16</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.02</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">has</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.13</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.12</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">delete</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.13</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.12</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">Size</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">Clear</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
              </tr>
      </tbody>
    </table>
  </div>
</div>

    

#### 10,000 Iterations

<div style="display: flex; flex-wrap: wrap; gap: 20px;">
  <div style="flex: 1; min-width: 400px; max-width: 600px;">
    <h5>Key Type: Object</h5>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Operation</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">DapperMapper (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Map (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Overhead (ms)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">set</td>
                <td style="border: 1px solid #ddd; padding: 8px;">5.73</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.34</td>
                <td style="border: 1px solid #ddd; padding: 8px;">5.39</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">get</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.67</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.22</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.45</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">has</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.54</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.14</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.4</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">delete</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.52</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.12</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.4</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">Size</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">Clear</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">set</td>
                <td style="border: 1px solid #ddd; padding: 8px;">17.4</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.66</td>
                <td style="border: 1px solid #ddd; padding: 8px;">15.74</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">get</td>
                <td style="border: 1px solid #ddd; padding: 8px;">20.7</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.32</td>
                <td style="border: 1px solid #ddd; padding: 8px;">19.38</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">has</td>
                <td style="border: 1px solid #ddd; padding: 8px;">14.69</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.25</td>
                <td style="border: 1px solid #ddd; padding: 8px;">13.44</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">delete</td>
                <td style="border: 1px solid #ddd; padding: 8px;">14.02</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.18</td>
                <td style="border: 1px solid #ddd; padding: 8px;">12.84</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">Size</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">Clear</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
              </tr>
      </tbody>
    </table>
  </div>
  <div style="flex: 1; min-width: 300px; max-width: 600px;">
    <h5>Key Type: String (10,000 iterations)</h5>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Operation</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">DapperMapper (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Map (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Overhead (ms)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">set</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.31</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.24</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.07</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">get</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.18</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.16</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.02</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">has</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.13</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.12</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">delete</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.13</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.12</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">Size</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">Clear</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">set</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.89</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.62</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.27</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">get</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.27</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.16</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.11</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">has</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.15</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.08</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.07</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">delete</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.44</td>
                <td style="border: 1px solid #ddd; padding: 8px;">2.14</td>
                <td style="border: 1px solid #ddd; padding: 8px;">-0.7</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">Size</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">Clear</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
              </tr>
      </tbody>
    </table>
  </div>
</div>

    

#### 100,000 Iterations

<div style="display: flex; flex-wrap: wrap; gap: 20px;">
  <div style="flex: 1; min-width: 400px; max-width: 600px;">
    <h5>Key Type: Object</h5>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Operation</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">DapperMapper (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Map (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Overhead (ms)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">set</td>
                <td style="border: 1px solid #ddd; padding: 8px;">5.73</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.34</td>
                <td style="border: 1px solid #ddd; padding: 8px;">5.39</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">get</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.67</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.22</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.45</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">has</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.54</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.14</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.4</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">delete</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.52</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.12</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.4</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">Size</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">Clear</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">set</td>
                <td style="border: 1px solid #ddd; padding: 8px;">17.4</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.66</td>
                <td style="border: 1px solid #ddd; padding: 8px;">15.74</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">get</td>
                <td style="border: 1px solid #ddd; padding: 8px;">20.7</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.32</td>
                <td style="border: 1px solid #ddd; padding: 8px;">19.38</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">has</td>
                <td style="border: 1px solid #ddd; padding: 8px;">14.69</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.25</td>
                <td style="border: 1px solid #ddd; padding: 8px;">13.44</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">delete</td>
                <td style="border: 1px solid #ddd; padding: 8px;">14.02</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.18</td>
                <td style="border: 1px solid #ddd; padding: 8px;">12.84</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">Size</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">Clear</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">set</td>
                <td style="border: 1px solid #ddd; padding: 8px;">146.57</td>
                <td style="border: 1px solid #ddd; padding: 8px;">20.92</td>
                <td style="border: 1px solid #ddd; padding: 8px;">125.65</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">get</td>
                <td style="border: 1px solid #ddd; padding: 8px;">152.15</td>
                <td style="border: 1px solid #ddd; padding: 8px;">12.7</td>
                <td style="border: 1px solid #ddd; padding: 8px;">139.45</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">has</td>
                <td style="border: 1px solid #ddd; padding: 8px;">147.74</td>
                <td style="border: 1px solid #ddd; padding: 8px;">12.52</td>
                <td style="border: 1px solid #ddd; padding: 8px;">135.22</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">delete</td>
                <td style="border: 1px solid #ddd; padding: 8px;">144.48</td>
                <td style="border: 1px solid #ddd; padding: 8px;">12.56</td>
                <td style="border: 1px solid #ddd; padding: 8px;">131.92</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">Size</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">Clear</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
              </tr>
      </tbody>
    </table>
  </div>
  <div style="flex: 1; min-width: 300px; max-width: 600px;">
    <h5>Key Type: String (100,000 iterations)</h5>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Operation</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">DapperMapper (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Map (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Overhead (ms)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">set</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.31</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.24</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.07</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">get</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.18</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.16</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.02</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">has</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.13</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.12</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">delete</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.13</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.12</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">Size</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.01</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">Clear</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">set</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.89</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.62</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.27</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">get</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.27</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.16</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.11</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">has</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.15</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.08</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.07</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">delete</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.44</td>
                <td style="border: 1px solid #ddd; padding: 8px;">2.14</td>
                <td style="border: 1px solid #ddd; padding: 8px;">-0.7</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">Size</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">Clear</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">set</td>
                <td style="border: 1px solid #ddd; padding: 8px;">20.17</td>
                <td style="border: 1px solid #ddd; padding: 8px;">27.52</td>
                <td style="border: 1px solid #ddd; padding: 8px;">-7.35</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">get</td>
                <td style="border: 1px solid #ddd; padding: 8px;">21.55</td>
                <td style="border: 1px solid #ddd; padding: 8px;">17.91</td>
                <td style="border: 1px solid #ddd; padding: 8px;">3.64</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">has</td>
                <td style="border: 1px solid #ddd; padding: 8px;">18.11</td>
                <td style="border: 1px solid #ddd; padding: 8px;">17.78</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.33</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">delete</td>
                <td style="border: 1px solid #ddd; padding: 8px;">18.01</td>
                <td style="border: 1px solid #ddd; padding: 8px;">18.53</td>
                <td style="border: 1px solid #ddd; padding: 8px;">-0.52</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">Size</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">Clear</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
              </tr>
      </tbody>
    </table>
  </div>
</div>

---
