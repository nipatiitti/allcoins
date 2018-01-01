import React, { Component } from 'react';
import './App.css';
import 'whatwg-fetch'

import { withStyles } from 'material-ui/styles';
import { purple } from 'material-ui/colors';
import { CircularProgress } from 'material-ui/Progress';
import Icon from 'material-ui/Icon';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';

var randomstring = require("randomstring");

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    background: theme.palette.background.paper,
    overflowX: 'auto',
  },
});


class App extends Component {

  constructor(props) {
	   super(props);

     this.state = {
       data: []
     }

  }

  componentDidMount() {

    let initial = "https://api.coinmarketcap.com/v1/ticker/?limit=0&convert=EUR";
    let continuous = "https://api.coinmarketcap.com/v1/ticker/?convert=EUR";

    this.getData(initial);

    setInterval(() => this.getData(initial), 315000);
  }

  getData(url) {
    fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {

      this.setState({
        data
      });
    })
    .catch((ex) => {
      console.log('Fetch failed', ex)
    });
  }

  renderCell(data, name) {
    const iconToShow = data[name] >= 0 ?
      <Icon color="primary">arrow_drop_up</Icon>
    :
      <Icon color="error">arrow_drop_down</Icon>
    ;

    return(
      <TableCell numeric><div className="cellContainer"><div className="cellData">{iconToShow}</div> <div className="cellData">{data[name]}</div></div></TableCell>
    )
  }

  render() {

    const { classes } = this.props;

    const table = this.state.data === [] ?
      <div className={classes.root}>
        <CircularProgress color="accent" />
      </div>
    :
      <Paper className={classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>
                <Icon style={{color: purple['A400']}}>euro_symbol</Icon>
              </TableCell>
              <TableCell numeric>{"1h"}</TableCell>
              <TableCell numeric>{"24h"}</TableCell>
              <TableCell numeric>{"7d"}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.data.map((n, i) => {
              return (
                <TableRow key={randomstring.generate(8)}>
                  <TableCell>{i+1 + ": " + n.id}</TableCell>
                  <TableCell numeric>
                    <div className="cellContainer">
                      <div className="cellData">
                        {n.price_eur}
                      </div>
                    </div>
                  </TableCell>
                  {this.renderCell(n, 'percent_change_1h')}
                  {this.renderCell(n, 'percent_change_24h')}
                  {this.renderCell(n, 'percent_change_7d')}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    ;

    return (
      <div>
        {table}
      </div>
    );
  }
}

export default withStyles(styles)(App);
