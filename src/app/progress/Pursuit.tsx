import React from 'react';
import { DimItem } from 'app/inventory/item-types';
import ItemPopupTrigger from 'app/inventory/ItemPopupTrigger';
import ItemExpiration from 'app/item-popup/ItemExpiration';
import PursuitItem from './PursuitItem';
import { percent } from 'app/shell/filters';

/**
 * A Pursuit is an inventory item that represents a bounty or quest. This displays
 * a pursuit tile for the Progress page.
 */
export default function Pursuit({ item }: { item: DimItem }) {
  const expired = showPursuitAsExpired(item);

  const nonIntegerObjectives = item.objectives
    ? item.objectives.filter((o) => o.displayStyle !== 'integer')
    : [];

  const showObjectiveDetail = nonIntegerObjectives.length === 1 && !nonIntegerObjectives[0].boolean;

  const showObjectiveProgress =
    nonIntegerObjectives.length > 1 ||
    (nonIntegerObjectives.length === 1 && !nonIntegerObjectives[0].boolean);

  return (
    <div className="milestone-quest" key={item.index}>
      <div className="milestone-icon">
        <ItemPopupTrigger item={item}>
          <PursuitItem item={item} />
        </ItemPopupTrigger>
        {!item.complete && !expired && showObjectiveProgress && (
          <span>
            {item.objectives && showObjectiveDetail ? (
              <>
                {nonIntegerObjectives[0].progress.toLocaleString()}
                <wbr />/<wbr />
                {nonIntegerObjectives[0].completionValue.toLocaleString()}
              </>
            ) : (
              percent(item.percentComplete)
            )}
          </span>
        )}
      </div>
      <div className="milestone-info">
        <span className="milestone-name">
          <ItemExpiration item={item} compact={true} />
          {item.name}
        </span>
        <div className="milestone-description">{item.description}</div>
      </div>
    </div>
  );
}

/**
 * Should this item be displayed as expired (no longer completable)?
 */
export function showPursuitAsExpired(item: DimItem) {
  // Suppress description when expiration is shown
  const suppressExpiration =
    item.isDestiny2() &&
    item.quest &&
    item.quest.suppressExpirationWhenObjectivesComplete &&
    item.complete;

  const expired =
    !suppressExpiration && item.isDestiny2() && item.quest && item.quest.expirationDate
      ? item.quest.expirationDate.getTime() < Date.now()
      : false;

  return expired;
}
