import { IApi } from 'umi-types';
import path from 'path';
import fs from 'fs';
import webpack from 'webpack';

interface Options {
  [moduleName: string]: [string | object | RegExp | Function, string]; // 数组的第二项是本地 external 模块路径
}

export default (api: IApi, opts: Options) => {
  api.onOptionChange(newOpts => {
    opts = newOpts;
    api.rebuildTmpFiles();
  });

  const externals = {};
  // webpack externals 配置
  Object.keys(opts).forEach((moduleName: string) => {
    if (!moduleName) {
      throw new Error('[umi-plugin-externals]: The first item in array should be a valid webpack externals value.')
    }
    externals[moduleName] = opts[moduleName][0];
  });

  // 设置为 externals
  api.chainWebpackConfig(config => {
    config.merge({
      externals: {
        ...externals,
      },
    });
    api.log.success('Successfully configure webpack externals:\n');
    console.log(JSON.stringify(config.toConfig().externals, null, 2) + '\n');
  });

  // 直接插入模块代码到 output 的头部
  api.chainWebpackConfig(config => {
    config.plugin('external-module').use(webpack.BannerPlugin, [{
      banner: `
      (function() {
        ${
          Object.keys(opts).map(moduleName => {
            return `(function() {
            ${fs.readFileSync(api.winPath(path.resolve(process.cwd(), opts[moduleName][1])), { encoding: 'utf8' })}
            })();`;
          }).join('\n')
        }
      })();`,
      raw: true,
      entryOnly: true,
      include: /umi\.js$/,
    }]);
  });
};
