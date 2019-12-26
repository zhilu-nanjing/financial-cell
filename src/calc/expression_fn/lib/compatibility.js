import * as mathTrig from './math-trig'
import * as statistical from './statistical'
import * as engineering from './engineering'
import * as dateTime from './date_time'

function set(target, source) {
  if (source) {
    for (let i in source) {
      target[i] = source[i];
    }
  }
  return target;
}

exports.BETADIST = statistical.BETA.DIST;
exports.BETAINV = statistical.BETA.INV;
exports.BINOMDIST = statistical.BINOM.DIST;
exports.CEILING = exports.ISOCEILING = set(mathTrig.CEILING.MATH, mathTrig.CEILING);
exports.CEILINGMATH = mathTrig.CEILING.MATH;
exports.CEILINGPRECISE = mathTrig.CEILING.PRECISE;
exports.CHIDIST = statistical.CHISQ__DIST;
exports.CHIDISTRT = statistical.CHISQ__DIST.RT;
exports.CHIINV = statistical.CHISQ__INV;
exports.CHIINVRT = statistical.CHISQ__INV__RT;
exports.CHITEST = statistical.CHISQ__TEST;
exports.CONFIDENCE = set(statistical.CONFIDENCE.NORM, statistical.CONFIDENCE);
exports.COVAR = statistical.COVARIANCE.P;
exports.COVARIANCEP = statistical.COVARIANCE.P;
exports.COVARIANCES = statistical.COVARIANCE.S;
exports.CRITBINOM = statistical.BINOM.INV;
exports.EXPONDIST = statistical.EXPON.DIST;
exports.ERFCPRECISE = engineering.ERFC.PRECISE;
exports.ERFPRECISE = engineering.ERF.PRECISE;
exports.FDIST = statistical.F.DIST;
exports.FDISTRT = statistical.F.DIST.RT;
exports.FINVRT = statistical.F.INV.RT;
exports.FINV = statistical.F.INV;
// XW：FLOOR函数修改
// exports.FLOOR = set(mathTrig.FLOORMATH, mathTrig.FLOOR);//11.5-调用矛盾
exports.FLOORMATH = mathTrig.FLOORMATH;
exports.FLOORPRECISE = mathTrig.FLOORPRACE;
//XW：end
exports.FTEST = statistical.F.TEST;
exports.GAMMADIST = statistical.GAMMA.DIST;
exports.GAMMAINV = statistical.GAMMA.INV;
exports.GAMMALNPRECISE = statistical.GAMMALN.PRECISE;
exports.HYPGEOMDIST = statistical.HYPGEOM.DIST;
exports.LOGINV = statistical.LOGNORM.INV;
exports.LOGNORMINV = statistical.LOGNORM.INV;
exports.LOGNORMDIST = statistical.LOGNORM.DIST;
exports.MODE = set(statistical.MODE.SNGL, statistical.MODE);
exports.MODEMULT = statistical.MODE.MULT;
exports.MODESNGL = statistical.MODE.SNGL;
exports.NEGBINOMDIST = statistical.NEGBINOM.DIST;
exports.NETWORKDAYSINTL = dateTime.NETWORKDAYSINTL;
exports.NORMDIST = statistical.NORM.DIST;
exports.NORMINV = statistical.NORM.INV;
exports.NORMSDIST = statistical.NORM.S.DIST;
exports.NORMSINV = statistical.NORM.S.INV;
exports.PERCENTILE = set(statistical.PERCENTILE.EXC, statistical.PERCENTILE);
exports.PERCENTILEEXC = statistical.PERCENTILE.EXC;
exports.PERCENTILEINC = statistical.PERCENTILE.INC;
exports.PERCENTRANK = set(statistical.PERCENTRANK.INC, statistical.PERCENTRANK);
exports.PERCENTRANKEXC = statistical.PERCENTRANK.EXC;
exports.PERCENTRANKINC = statistical.PERCENTRANK.INC;
exports.POISSON = set(statistical.POISSON.DIST, statistical.POISSON);
exports.POISSONDIST = statistical.POISSON.DIST;
exports.QUARTILE = set(statistical.QUARTILE.INC, statistical.QUARTILE);
exports.QUARTILEEXC = statistical.QUARTILE.EXC;
exports.QUARTILEINC = statistical.QUARTILE.INC;
exports.RANK = set(statistical.RANK.EQ, statistical.RANK);
exports.RANKAVG = statistical.RANK.AVG;
exports.RANKEQ = statistical.RANK.EQ;
exports.SKEWP = statistical.SKEW.P;
exports.STDEV = set(statistical.STDEV.S, statistical.STDEV);
exports.STDEVP = statistical.STDEV.P;
exports.STDEVS = statistical.STDEV.S;
exports.TDIST = statistical.T.DIST;
exports.TDISTRT = statistical.T.DIST.RT;
exports.TINV = statistical.T.INV;
exports.TTEST = statistical.T.TEST;
// exports.VAR = set(statistical.VAR.S, statistical.VAR);
exports.VARP = statistical.VAR.P;
exports.VARS = statistical.VAR.S;
exports.WEIBULL = set(statistical.WEIBULL.DIST, statistical.WEIBULL);
exports.WEIBULLDIST = statistical.WEIBULL.DIST;
exports.WORKDAYINTL = dateTime.WORKDAYINTL;
exports.ZTEST = statistical.Z.TEST;
//XW: _XLFN开头函数处理
exports._XLFN = set(mathTrig.FLOOR.MATH, statistical.COVARIANCE.P, statistical.NORM.INV, statistical.VAR.P)
// exports._XLFN.FLOOR = mathTrig.FLOOR
// exports._XLFN.COVARIANCE = statistical.COVARIANCE
// exports._XLFN.NORM = statistical.NORM
// exports._XLFN.VAR = statistical.VAR
//XW：end
