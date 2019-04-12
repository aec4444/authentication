import * as React from 'react';
import { CustomerInventoryCountProps } from './customer-inventory-count-props.model';

export class CustomerInventoryCount extends React.Component<CustomerInventoryCountProps> {
  constructor(props: CustomerInventoryCountProps) {
    super(props);
  }

  render() {
    const { page, count, pageSize } = this.props;
    const startNum = (page * pageSize + 1);
    const endNum = Math.min(((page + 1) * pageSize), count);

    return (
      <React.Fragment>
        <p>
          Page {page+1} - Surveys {startNum}-{endNum} of {count} rows.
        </p>
      </React.Fragment>
    );
  }
}
