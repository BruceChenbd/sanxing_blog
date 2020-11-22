import * as React from 'react';
import { Spin } from 'antd';

import './index.scss';

export default function Loading() {
  return (
    <div className="loading-page">
      <Spin />
    </div>
  );
}