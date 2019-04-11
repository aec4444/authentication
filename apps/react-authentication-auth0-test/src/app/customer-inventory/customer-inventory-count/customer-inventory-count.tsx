import * as React from 'react';
import { CustomerInventoryCountProps } from './customer-inventory-count-props.model';

export class CustomerInventoryCount extends React.Component<CustomerInventoryCountProps> {
  constructor(props: CustomerInventoryCountProps) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <p>
          Querying Customer Inventory yielded {this.props.count} rows.
        </p>
      </React.Fragment>
    );
  }
}
