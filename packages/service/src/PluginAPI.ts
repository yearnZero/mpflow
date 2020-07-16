import path from 'path'
import { Arguments, CommandModule, InferredOptionTypes, Options } from 'yargs'
import Service, { WeflowConfig } from './Service'
import { Configuration } from 'webpack'
import WebpackChain from 'webpack-chain'

export interface Plugin {
  (api: PluginAPI, config: WeflowConfig): void

  generator?: <C>(api: any, config: C) => void
}

export class BaseAPI<T> {
  public id: string
  protected service: Service
  protected shared: Partial<T>

  constructor(id: string, service: Service, shared: Partial<T> = {}) {
    this.id = id
    this.service = service
    this.shared = shared
  }

  get mode() {
    return this.service.mode
  }

  set mode(mode: string) {
    this.service.mode = mode
  }

  getCwd() {
    return this.service.context
  }

  resolve(_path: string) {
    return path.resolve(this.service.context, _path)
  }

  hasPlugin(id: string) {
    return this.service.plugins.some(p => p.id === id)
  }
}

export class PluginAPI extends BaseAPI<unknown> {
  registerCommand<
    T = Record<string, unknown>,
    O extends { [key: string]: Options } = Record<string, unknown>,
    U = Record<string, unknown>
  >(
    command: CommandModule['command'],
    describe: CommandModule['describe'],
    options: O,
    handler: (args: Arguments<Omit<T, keyof O> & InferredOptionTypes<O>>) => void,
  ) {
    this.service.registerCommand({
      command,
      describe,
      handler,
      builder: yargs => yargs.options(options),
    })
  }

  configureWebpack(config: (config: WebpackChain) => void) {
    this.service.webpackConfigs.push(config)
  }

  resolveWebpackConfig() {
    return this.service.resolveWebpackConfig()
  }
}
