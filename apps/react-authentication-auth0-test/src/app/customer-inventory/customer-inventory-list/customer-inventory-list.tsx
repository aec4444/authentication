import * as React from 'react';
import { CustomerInventoryListProps } from './customer-inventory-list-props.model';
import { Customer } from '../models/customers';

export class CustomerInventoryList extends React.Component<CustomerInventoryListProps> {
  constructor(props: CustomerInventoryListProps) {
    super(props);
  }

  render() {
    const listItems = this.props.pageData.map((i: Customer) => {
      return (
        <tr key={i.customerID}>
          <td>{i.customerName}</td>
          <td>{i.city}</td>
          <td>{i.state}</td>
        </tr>
      )
    });

    return (
      <React.Fragment>
        <div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {listItems}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}
