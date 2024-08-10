import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients.filter(client => !client.status || client.status === 'backlog'),
        inProgress: clients.filter(client => client.status && client.status === 'in-progress'),
        complete: clients.filter(client => client.status && client.status === 'complete'),
      }
    };
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    };
  }

  componentDidMount() {
    this.initializeDragula();
  }

  initializeDragula() {
    const containers = [
      this.swimlanes.backlog.current,
      this.swimlanes.inProgress.current,
      this.swimlanes.complete.current
    ];

    const drake = Dragula(containers);

    drake.on('drop', (el, target, source, sibling) => {
      const cardId = el.getAttribute('data-id');
      const targetSwimlane = target.parentElement.getAttribute('data-swimlane');

      this.updateCardStatus(cardId, targetSwimlane);
      this.updateCardStyle(el, targetSwimlane);
    });
  }

  updateCardStatus(cardId, targetSwimlane) {
    this.setState(prevState => {
      const clients = { ...prevState.clients };
  
      // Check if the targetSwimlane is valid
      if (!clients[targetSwimlane]) {
        console.error(`Invalid swimlane: ${targetSwimlane}`);
        return prevState; // Exit early if the swimlane is invalid
      }
  
      // Find the card in its current swimlane
      for (const lane in clients) {
        const clientIndex = clients[lane].findIndex(client => client.id === cardId);
        if (clientIndex > -1) {
          const [movedClient] = clients[lane].splice(clientIndex, 1);
          movedClient.status = targetSwimlane;
          clients[targetSwimlane].push(movedClient);
          break;
        }
      }
  
      return { clients };
    });
  }
  

  updateCardStyle(cardElement, swimlane) {
    cardElement.classList.remove('Card-grey', 'Card-blue', 'Card-green');
    if (swimlane === 'backlog') {
      cardElement.classList.add('Card-grey');
    } else if (swimlane === 'in-progress') {
      cardElement.classList.add('Card-blue');
    } else if (swimlane === 'complete') {
      cardElement.classList.add('Card-green');
    }
  }

  getClients() {
    return [
      ['1', 'Stark, White and Abbott', 'Cloned Optimal Architecture', 'backlog'],
      ['2', 'Wiza LLC', 'Exclusive Bandwidth-Monitored Implementation', 'backlog'],
      ['3', 'Nolan LLC', 'Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4', 'Thompson PLC', 'Streamlined Regional Knowledgeuser', 'backlog'],
      ['5', 'Walker-Williamson', 'Team-Oriented 6Thgeneration Matrix', 'backlog'],
      ['6', 'Boehm and Sons', 'Automated Systematic Paradigm', 'backlog'],
      ['7', 'Runolfsson, Hegmann and Block', 'Integrated Transitional Strategy', 'backlog'],
      ['8', 'Schumm-Labadie', 'Operative Heuristic Challenge', 'backlog'],
      ['9', 'Kohler Group', 'Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10', 'Romaguera Inc', 'Managed Foreground Toolset', 'backlog'],
      ['11', 'Reilly-King', 'Future-Proofed Interactive Toolset', 'backlog'],
      ['12', 'Emard, Champlin and Runolfsdottir', 'Devolved Needs-Based Capability', 'backlog'],
      ['13', 'Fritsch, Cronin and Wolff', 'Open-Source 3Rdgeneration Website', 'backlog'],
      ['14', 'Borer LLC', 'Profit-Focused Incremental Orchestration', 'backlog'],
      ['15', 'Emmerich-Ankunding', 'User-Centric Stable Extranet', 'backlog'],
      ['16', 'Willms-Abbott', 'Progressive Bandwidth-Monitored Access', 'backlog'],
      ['17', 'Brekke PLC', 'Intuitive User-Facing Customerloyalty', 'backlog'],
      ['18', 'Bins, Toy and Klocko', 'Integrated Assymetric Software', 'backlog'],
      ['19', 'Hodkiewicz-Hayes', 'Programmable Systematic Securedline', 'backlog'],
      ['20', 'Murphy, Lang and Ferry', 'Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }

  renderSwimlane(name, clients, ref) {
    return (
      <Swimlane
        className="Swimlane-column"
        name={name}
        clients={clients}
        dragulaRef={ref}
      />
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4" data-swimlane="backlog">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4" data-swimlane="in-progress">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4" data-swimlane="complete">
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
