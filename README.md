# Dope Map

A wrapper around Map for hashing complex object keys by value. This allows you to reference the same Map value using objects that are deep equal but not referentially equal.

## Installation

```bash
yarn add dope-map
```

## Usage

```javascript
import DopeMap from "dope-map";

const dopeMap = new DopeMap();

dopeMap.set({ foo: "bar", to: "fu" }, [1, 2, 3, 4, 5]);

dopeMap.get({ foo: "bar", to: "fu" }); // [1, 2, 3, 4, 5]
dopeMap.get({ to: "fu", foo: "bar" }); // [1, 2, 3, 4, 5]
```

## Benchmark Results

This library comes with performance tradeoffs, so if your main goal is performance over efficiency, this likely isn't the right approach, especially when you are processing a large amount of data.

#### 1,000 Iterations

<div style="display: flex; flex-wrap: wrap; gap: 20px;">
  <div style="flex: 1; min-width: 400px; max-width: 600px;">
    <h5>Key Type: Object</h5>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Operation</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">dopeMapper (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Map (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Overhead (ms)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">set</td>
                <td style="border: 1px solid #ddd; padding: 8px;">2.32</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.31</td>
                <td style="border: 1px solid #ddd; padding: 8px;">2.01</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">get</td>
                <td style="border: 1px solid #ddd; padding: 8px;">3.49</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.2</td>
                <td style="border: 1px solid #ddd; padding: 8px;">3.29</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">has</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.46</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.15</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.31</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">delete</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.42</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.12</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.3</td>
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
  <div style="flex: 1; min-width: 400px; max-width: 600px;">
    <h5>Key Type: String (1,000 iterations)</h5>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Operation</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">dopeMapper (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Map (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Overhead (ms)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">set</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.28</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.24</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.04</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">get</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.17</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.15</td>
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
                <td style="border: 1px solid #ddd; padding: 8px;">0.12</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.12</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
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
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">dopeMapper (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Map (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Overhead (ms)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">set</td>
                <td style="border: 1px solid #ddd; padding: 8px;">15.11</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.47</td>
                <td style="border: 1px solid #ddd; padding: 8px;">13.64</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">get</td>
                <td style="border: 1px solid #ddd; padding: 8px;">14.06</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.22</td>
                <td style="border: 1px solid #ddd; padding: 8px;">12.84</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">has</td>
                <td style="border: 1px solid #ddd; padding: 8px;">14.4</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.17</td>
                <td style="border: 1px solid #ddd; padding: 8px;">13.23</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">delete</td>
                <td style="border: 1px solid #ddd; padding: 8px;">13.52</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.17</td>
                <td style="border: 1px solid #ddd; padding: 8px;">12.35</td>
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
  <div style="flex: 1; min-width: 400px; max-width: 600px;">
    <h5>Key Type: String (10,000 iterations)</h5>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Operation</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">dopeMapper (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Map (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Overhead (ms)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">set</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.9</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.65</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.25</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">get</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.25</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.16</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.09</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">has</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.14</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.15</td>
                <td style="border: 1px solid #ddd; padding: 8px;">-0.01</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">delete</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.43</td>
                <td style="border: 1px solid #ddd; padding: 8px;">1.35</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.08</td>
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
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">dopeMapper (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Map (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Overhead (ms)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">set</td>
                <td style="border: 1px solid #ddd; padding: 8px;">146.31</td>
                <td style="border: 1px solid #ddd; padding: 8px;">23.5</td>
                <td style="border: 1px solid #ddd; padding: 8px;">122.81</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">get</td>
                <td style="border: 1px solid #ddd; padding: 8px;">150.37</td>
                <td style="border: 1px solid #ddd; padding: 8px;">12.69</td>
                <td style="border: 1px solid #ddd; padding: 8px;">137.68</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">has</td>
                <td style="border: 1px solid #ddd; padding: 8px;">142.09</td>
                <td style="border: 1px solid #ddd; padding: 8px;">12.65</td>
                <td style="border: 1px solid #ddd; padding: 8px;">129.44</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">delete</td>
                <td style="border: 1px solid #ddd; padding: 8px;">145.3</td>
                <td style="border: 1px solid #ddd; padding: 8px;">12.53</td>
                <td style="border: 1px solid #ddd; padding: 8px;">132.77</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">Size</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0</td>
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
  <div style="flex: 1; min-width: 400px; max-width: 600px;">
    <h5>Key Type: String (100,000 iterations)</h5>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Operation</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">dopeMapper (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Map (ms)</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f4f4f4;">Overhead (ms)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">set</td>
                <td style="border: 1px solid #ddd; padding: 8px;">20.33</td>
                <td style="border: 1px solid #ddd; padding: 8px;">21.6</td>
                <td style="border: 1px solid #ddd; padding: 8px;">-1.27</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">get</td>
                <td style="border: 1px solid #ddd; padding: 8px;">27.48</td>
                <td style="border: 1px solid #ddd; padding: 8px;">16.97</td>
                <td style="border: 1px solid #ddd; padding: 8px;">10.51</td>
              </tr>
<tr style="background-color: #f2f2f2">
                <td style="border: 1px solid #ddd; padding: 8px;">has</td>
                <td style="border: 1px solid #ddd; padding: 8px;">16.74</td>
                <td style="border: 1px solid #ddd; padding: 8px;">16.55</td>
                <td style="border: 1px solid #ddd; padding: 8px;">0.19</td>
              </tr>
<tr style="background-color: white">
                <td style="border: 1px solid #ddd; padding: 8px;">delete</td>
                <td style="border: 1px solid #ddd; padding: 8px;">18.3</td>
                <td style="border: 1px solid #ddd; padding: 8px;">19</td>
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

---
