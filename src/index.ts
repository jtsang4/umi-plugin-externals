import { IApi } from 'umi-types';
import path from 'path';
// import fs from 'fs';

interface Options {
  [moduleName: string]: [string | object | RegExp | Function, string];
}

export default (api: IApi, opts: Options) => {
  // const { paths } = api;
  // const { absTmpDirPath } = paths;

  const externals = {};
  // webpack externals 配置
  Object.keys(opts).forEach((moduleName: string) => {
    externals[moduleName] = opts[moduleName][0];
  });

  // // 等待插入的模块字符串
  // const externalsScript = Object.keys(opts)
  //   .map((moduleName: string) => {
  //     const filePath = api.winPath(path.resolve(process.cwd(), opts[moduleName][1]));
  //     return fs.readFileSync(filePath, { encoding: 'utf8' });
  //   })
  //   .join('\n\n');

  // 设置为 externals
  api.chainWebpackConfig(webpackConfig => {
    webpackConfig.merge({
      externals: {
        ...externals,
      },
    });
    api.log.success('Successfully configure webpack externals:\n');
    api.log.info('\n' + JSON.stringify(webpackConfig.toConfig().externals, null, 2) + '\n');
  });

  // const addHeadScript = () => {
  //   const insertedFlag = '[umi-plugin-prepend]';
  //   const umiFilePath = api.winPath(path.resolve(absTmpDirPath, './umi.js'));
  //   const umijsContent = fs.readFileSync(umiFilePath, 'utf-8');
  //   if (!umijsContent.includes(insertedFlag)) {
  //     api.writeTmpFile('umi.js', `
  //       // ${insertedFlag} start
  //       (() => {
  //         ${externalsScript}
  //       })();
  //       // ${insertedFlag} end
  //
  //       ${umijsContent}
  //     `);
  //   }
  // };

  api.onOptionChange(newOpts => {
    opts = newOpts;
    api.rebuildTmpFiles();
  });

  Object.keys(opts).map((moduleName: string) => {
    const filePath = api.winPath(path.resolve(process.cwd(), opts[moduleName][1]));
    api.addEntryPolyfillImports(() => {
      return [{ source: filePath }];
    });
  });

  // api.onBuildSuccessAsync(() => {
  //   addHeadScript();
  // });
  //
  // api.onDevCompileDone(({ isFirstCompile }) => {
  //   addHeadScript();
  // });
};
