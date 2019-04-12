import * as React from 'react';
import { CustomerInventoryList } from '../customer-inventory-list/customer-inventory-list';
import { connect } from 'react-redux';
import { CustomerInventoryContainerProps } from './customer-inventory-container-props.model';
import { CustomerState } from '../types';
import { CustomerInventoryCount } from '../customer-inventory-count/customer-inventory-count';
import { fetchRequest, fetchNextPage } from '../actions';


export class CustomerInventoryContainer extends React.Component<CustomerInventoryContainerProps> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    console.log('componentDidMount');
    if (this.props.fetchRequest) {
      this.props.fetchRequest();
    }
  }

  getNextPage = () => this.props.fetchNextPage();

  render() {
    const { pageData, count, page, pageSize } = this.props;
    let markup: any;

    if (pageData) {
      markup = (
        <div>
          <CustomerInventoryCount pageSize={pageSize} page={page} count={count}></CustomerInventoryCount>

          <button className="btn btn-primary" onClick={evt => this.getNextPage()}>Get Next Page</button>

          <CustomerInventoryList pageData={pageData}></CustomerInventoryList>
        </div>
      );
    }

    return (
      <React.Fragment>
        {markup}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps): CustomerInventoryContainerProps => ({
  pageData: state.customers.pageData,
  count: state.customers.count,
  pageSize: state.customers.pageSize,
  page: state.customers.page
});

const mapDispatchToProps = (dispatch): CustomerInventoryContainerProps => {
  console.log(dispatch);
  return {
    fetchRequest: () => dispatch(fetchRequest()),
    fetchNextPage: () => dispatch(fetchNextPage())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerInventoryContainer);
