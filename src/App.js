import React, { Component } from 'react';

import Layout from './hoc/Layout/Layout';
import Builder from './containers/Builder/Builder';

class App extends Component {
  render() {
    return (
      <div>
        <Layout>
          <Builder />
        </Layout>
      </div>
    );
  }
}

export default App;
