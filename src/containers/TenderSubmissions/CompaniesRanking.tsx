import React, { Component } from "react";
import { TenderSubmissionsListInterface } from "../../actions/validate-tender.action";
import { commaFy } from "../../utils/functions";

interface CompaniesRankingProps {
  selectedTenderSubmissions: TenderSubmissionsListInterface[];
}
interface CompaniesRankingState {}

export class CompaniesRanking extends Component<
  CompaniesRankingProps,
  CompaniesRankingState
> {
  constructor(props: CompaniesRankingProps) {
    super(props);

    this.state = {};
  }
  render() {
    if (this.props.selectedTenderSubmissions.length === 0) {
      return <div></div>;
    }
    const selectedTenders = this.props.selectedTenderSubmissions;
    return (
      <div className="p-4 md:mx-5 mt-8 rounded-md bg-gray-50">
        <div>
          <div className="flex flex-row items-center justify-between gap-2 w-full mb-4">
            <div>
              <div className="text-base font-bold">Companies ranking</div>
              <div className="text-sm text-gray-500">
                The list of recommended companies arranged in ascending
                depending on their specified financial plan amount after the
                evaluation
              </div>
            </div>
            <div>
              <div className="bg-primary-50 text-sm font-bold text-primary-900 rounded-lg px-2 py-1 w-max">
                Total: {selectedTenders.length}
              </div>
            </div>
          </div>
          <div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="px-3 py-2 border">#</th>
                  <th className="px-3 py-2 border">Company name</th>
                  <th className="px-3 py-2 border">TIN number</th>
                  <th className="px-3 py-2 border">Phone number</th>
                  <th className="px-3 py-2 border">Email</th>
                  <th className="px-3 py-2 border">Financial Budget</th>
                </tr>
              </thead>
              <tbody>
                {selectedTenders.map((item, i) => (
                  <tr key={i + 1}>
                    <td className="px-3 py-2 border">{i + 1}</td>
                    <td className="px-3 py-2 border">{item.compony_name}</td>
                    <td className="px-3 py-2 border">{item.tin_number}</td>
                    <td className="px-3 py-2 border">{item.company_phone}</td>
                    <td className="px-3 py-2 border">{item.company_email}</td>
                    <td className="px-3 py-2 border font-bold text-primary-900">
                      {item.financial_amount !== null &&
                        commaFy(item.financial_amount)}{" "}
                      RWF
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
