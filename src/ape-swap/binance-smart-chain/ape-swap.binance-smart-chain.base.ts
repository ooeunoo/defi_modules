import { Injectable } from '@nestjs/common';
import { Contract, ethers } from 'ethers';
import { Provider } from '@ethersproject/providers';
import {
  PROTOCOL_NAME,
  NETWORK_CHAIN_ID,
  NETWORK_CHAIN_TYPE,
} from '@seongeun/aggregator-base/lib/constant';

import { IContractInfo } from '@seongeun/aggregator-base/lib/contract/contract.interface';
import {
  ContractService,
  NetworkService,
  ProtocolService,
} from '@seongeun/aggregator-base/lib/service';
import { INFO } from '../ape-swap.constant';
import { DeFiProtocolBase } from '../../defi-protocol.base';

@Injectable()
export abstract class ApeSwapBinanceSmartChainBase extends DeFiProtocolBase {
  name = PROTOCOL_NAME.APE_SWAP;
  chainType = NETWORK_CHAIN_TYPE.EVM;
  chainId = NETWORK_CHAIN_ID.BINANCE_SMART_CHAIN;
  constants = INFO[NETWORK_CHAIN_ID.BINANCE_SMART_CHAIN];

  constructor(
    public readonly networkService: NetworkService,
    public readonly protocolService: ProtocolService,
    public readonly contractService: ContractService,
  ) {
    super(networkService, protocolService, contractService);
  }

  /***************************
   *  ACCESSOR
   ***************************/
  get provider(): Provider {
    return super.provider as Provider;
  }

  get farm(): IContractInfo {
    const name = this.constants.farm.name;
    const address = this.constants.farm.address;
    const abi = this.addressABI.get(address);
    return {
      name,
      address,
      abi,
    };
  }

  get dexFactory(): IContractInfo {
    const address = this.constants.dex.factory_address;
    const abi = this.addressABI.get(address);
    const initCodeHash = this.constants.dex.factory_init_code_hash;
    return {
      address,
      abi,
      initCodeHash,
    };
  }

  get nfToken(): IContractInfo {
    const name = this.constants.nf_token.name;
    const address = this.constants.nf_token.address;
    const abi = this.addressABI.get(address);
    return {
      name,
      address,
      abi,
    };
  }

  get farmContract(): Contract {
    return new ethers.Contract(this.farm.address, this.farm.abi, this.provider);
  }

  get dexFactoryContract(): Contract {
    return new ethers.Contract(
      this.dexFactory.address,
      this.dexFactory.abi,
      this.provider,
    );
  }

  get nfTokenContract(): Contract {
    return new ethers.Contract(
      this.nfToken.address,
      this.nfToken.abi,
      this.provider,
    );
  }
}
